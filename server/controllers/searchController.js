const Folder = require("../models/Folder");
const File = require("../models/File");

const search = async (req, res) => {

    try {
        const query = req.query.q?.trim();

        if (!query) {

            return res.status(200).json({
                success: true,
                folders: [],
                files: [],
            });
        }


        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedQuery, "i");

        const folders = await Folder.find({
            owner: req.user.id,
            name: regex,
            isDeleted: false,
        });

        const files = await File.find({
            owner: req.user.id,
            isDeleted: false,
            $or: [
                { originalName: regex },
                { "tags.name": regex },
                { textContent: regex },
            ],
        }).select("+textContent");

        const filesWithMatchInfo = files.map((file) => {
            const fileObj = file.toObject();
            let matchedIn = "name";
            let matchSnippet = null;

            if (regex.test(file.originalName)) {
                matchedIn = "name";
            } else if (file.tags && file.tags.some((t) => regex.test(t.name))) {
                matchedIn = "tag";
                const matchedTag = file.tags.find((t) => regex.test(t.name));
                matchSnippet = matchedTag ? `Tag: #${matchedTag.name}` : null;
            } else if (file.textContent && regex.test(file.textContent)) {
                matchedIn = "content";
                const match = regex.exec(file.textContent);
                if (match) {
                    const idx = match.index;
                    const start = Math.max(0, idx - 25);
                    const end = Math.min(file.textContent.length, idx + match[0].length + 35);
                    let snippet = file.textContent.substring(start, end).replace(/\r?\n|\r/g, " ");
                    if (start > 0) snippet = "..." + snippet;
                    if (end < file.textContent.length) snippet = snippet + "...";
                    matchSnippet = snippet;
                }
            }

            delete fileObj.textContent;
            fileObj.matchedIn = matchedIn;
            fileObj.matchSnippet = matchSnippet;
            return fileObj;
        });

        res.status(200).json({
            success: true,
            folders,
            files: filesWithMatchInfo,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to search.",
        });
    }
};

module.exports = { search }; 