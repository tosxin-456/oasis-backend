const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// node-fetch workaround for CommonJS
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const API_KEY = "YOUR_API_KEY_HERE"; // 🔹 replace this
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const OUTPUT_DIR = "./tmdb_full";
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * ✅ Auto-detect latest available export date from TMDB
 */
const getLatestExportDate = async () => {
    console.log("🔍 Checking for latest TMDB export date...");
    const baseUrl = "http://files.tmdb.org/p/exports/";
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error("Failed to load TMDB export page");
    const html = await res.text();

    // Match filenames like movie_ids_MM_DD_YYYY.json.gz
    const matches = [...html.matchAll(/movie_ids_(\d{2}_\d{2}_\d{4})\.json\.gz/g)];
    if (!matches.length) throw new Error("No valid export dates found!");
    const latest = matches[matches.length - 1][1];
    console.log(`📅 Latest export found: ${latest}`);
    return latest;
};

/**
 * Download the TMDB ID export file
 */
const downloadIdDump = async (type, dateStr) => {
    const fname = `${type}_ids_${dateStr}.json.gz`;
    const url = `http://files.tmdb.org/p/exports/${fname}`;
    console.log(`⬇️ Downloading ${fname}...`);

    const res = await fetch(url);
    if (!res.ok) {
        console.error(`❌ Failed to download ${fname}: ${res.status} ${res.statusText}`);
        return null;
    }
    const buffer = await res.arrayBuffer();
    const outPath = path.join(OUTPUT_DIR, fname);
    fs.writeFileSync(outPath, Buffer.from(buffer));
    console.log(`💾 Saved dump: ${outPath}`);
    return outPath;
};

/**
 * Parse the gzipped file into a list of TMDB IDs
 */
const parseIdDump = (gzPath) => {
    console.log(`📂 Parsing ${gzPath}...`);
    const data = fs.readFileSync(gzPath);
    const unz = zlib.gunzipSync(data).toString("utf-8");
    const lines = unz.split("\n").filter((l) => l.trim().length > 0);
    const objs = lines
        .map((l) => {
            try {
                return JSON.parse(l);
            } catch {
                return null;
            }
        })
        .filter(Boolean);
    console.log(`🧾 Parsed ${objs.length} IDs from ${path.basename(gzPath)}`);
    return objs.map((o) => o.id).filter((id) => typeof id === "number");
};

/**
 * Fetch full details for a given TMDB item (movie/tv)
 */
const fetchDetail = async (type, id) => {
    const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits,images`;
    try {
        const res = await fetch(url);
        if (res.status === 429) {
            console.warn("⚠️ Rate limit (429). Waiting...");
            await sleep(2000);
            return { retry: true };
        }
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error("❌ Error fetching detail:", err.message);
        return null;
    }
};

/**
 * Main process — fetch latest exports and download all metadata
 */
const runFullExport = async () => {
    const dateStr = await getLatestExportDate();
    const types = ["movie", "tv_series"];

    for (const type of types) {
        const gzPath = await downloadIdDump(type, dateStr);
        if (!gzPath) continue;
        const ids = parseIdDump(gzPath);

        console.log(`🚀 Starting detail fetch for ${ids.length} ${type}s...`);
        const outputData = [];
        const failed = [];

        // process in batches of 10 concurrently
        for (let i = 0; i < ids.length; i += 10) {
            const batch = ids.slice(i, i + 10);
            const results = await Promise.allSettled(
                batch.map((id) =>
                    fetchDetail(type === "tv_series" ? "tv" : "movie", id)
                )
            );

            results.forEach((r, index) => {
                if (r.status === "fulfilled" && r.value && !r.value.retry)
                    outputData.push(r.value);
                else failed.push(batch[index]);
            });

            console.log(
                `📦 Batch ${i}-${i + 10}: ${outputData.length} ok, ${failed.length} failed`
            );
            await sleep(1500);
        }

        // Save to disk
        const outF = path.join(OUTPUT_DIR, `${type}_full_${dateStr}.json`);
        fs.writeFileSync(outF, JSON.stringify(outputData, null, 2));
        console.log(`✅ Saved ${outputData.length} ${type} entries → ${outF}`);
    }

    console.log("🎉 All done!");
};

if (require.main === module) {
    runFullExport();
}

module.exports = { runFullExport };
