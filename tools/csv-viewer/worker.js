const index = [];
let leftover = "";
let offset = 0;

self.onmessage = async (e) => {
    if (e.data.done) {
        if (leftover.length > 0) {
            index.push({ start: offset, end: offset + new TextEncoder().encode(leftover).length });
        }
        self.postMessage({ type: "final", data: index });
        self.close();
    } else {
        const t = await e.data.chunk.text();
        const text = leftover + t;
        const lines = text.match(/[^\r\n]+(\r\n|\n|\r)?/g) || [];

        for (let line of lines) {
            if (!line.match(/(\r\n|\n|\r)$/)) {
                leftover = line;
                break;
            }
            const len = new TextEncoder().encode(line).length;
            index.push({
                start: offset,
                end: offset + len
            })
            offset += len;
        }
    }
}

