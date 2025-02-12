"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFMPEGClient = void 0;
class FFMPEGClient {
    constructor(baseUrl, apiToken) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        this.apiToken = apiToken;
    }
    getHeaders() {
        return {
            "Content-Type": "application/json",
            "X-API-Token": this.apiToken,
        };
    }
    async executeCommand(command) {
        const response = await fetch(`${this.baseUrl}/ffmpeg`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(command),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    async getJobStatus(uuid) {
        const response = await fetch(`${this.baseUrl}/ffmpeg/progress/${uuid}`, {
            method: "GET",
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    createCommand() {
        return new FFmpegCommandBuilder(this);
    }
}
exports.FFMPEGClient = FFMPEGClient;
class FFmpegCommandBuilder {
    constructor(client) {
        this.inputPath = "";
        this.outputPath = "";
        this.additionalOptions = [];
        this.client = client;
    }
    input(path) {
        this.inputPath = path;
        return this;
    }
    output(path) {
        this.outputPath = path;
        return this;
    }
    setVideoCodec(codec) {
        this.videoCodec = codec;
        return this;
    }
    setAudioCodec(codec) {
        this.audioCodec = codec;
        return this;
    }
    setVideoBitrate(bitrate) {
        this.videoBitrate = bitrate;
        return this;
    }
    setAudioBitrate(bitrate) {
        this.audioBitrate = bitrate;
        return this;
    }
    setSize(size) {
        this.size = size;
        return this;
    }
    setFPS(fps) {
        this.fps = fps;
        return this;
    }
    addOption(option) {
        this.additionalOptions.push(option);
        return this;
    }
    build() {
        const commands = [];
        // Add input
        commands.push("-i {{in1}}");
        // Add video codec
        if (this.videoCodec) {
            commands.push("-c:v", this.videoCodec);
        }
        // Add audio codec
        if (this.audioCodec) {
            commands.push("-c:a", this.audioCodec);
        }
        // Add video bitrate
        if (this.videoBitrate) {
            commands.push("-b:v", this.videoBitrate);
        }
        // Add audio bitrate
        if (this.audioBitrate) {
            commands.push("-b:a", this.audioBitrate);
        }
        // Add size
        if (this.size) {
            commands.push("-s", this.size);
        }
        // Add fps
        if (this.fps) {
            commands.push("-r", this.fps.toString());
        }
        // Add additional options
        commands.push(...this.additionalOptions);
        // Add output
        commands.push("{{out1}}");
        return {
            ffmpeg_command: commands.join(" "),
            input_files: {
                in1: this.inputPath,
            },
            output_files: {
                out1: this.outputPath,
            },
        };
    }
    async execute() {
        const command = this.build();
        return this.client.executeCommand(command);
    }
    async executeAndWait(pollInterval = 1000, timeout = 300000) {
        const startTime = Date.now();
        const response = await this.execute();
        while (Date.now() - startTime < timeout) {
            const status = await this.client.getJobStatus(response.uuid);
            if (status.status === "completed" || status.status === "failed") {
                return status;
            }
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }
        throw new Error("Operation timed out");
    }
}
