"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFmpegCommandBuilder = void 0;
class FFmpegCommandBuilder {
    constructor() {
        this.inputPath = "";
        this.outputPath = "";
        this.videoFilters = [];
        this.audioFilters = [];
        this.metadata = {};
        this.additionalOptions = [];
    }
    input(path) {
        this.inputPath = path;
        return this;
    }
    output(path) {
        this.outputPath = path;
        return this;
    }
    // Video encoding options
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
    // Advanced encoding options
    setPreset(preset) {
        this.preset = preset;
        return this;
    }
    setCRF(crf) {
        this.crf = crf;
        return this;
    }
    setThreads(threads) {
        this.threads = threads;
        return this;
    }
    // Time-related options
    setSeek(time) {
        this.seekTime = time;
        return this;
    }
    setDuration(duration) {
        this.duration = duration;
        return this;
    }
    // Video filters
    addVideoFilter(filter) {
        this.videoFilters.push(filter);
        return this;
    }
    rotate(degrees) {
        return this.addVideoFilter(`rotate=${degrees}*PI/180`);
    }
    crop(width, height, x, y) {
        const position = x !== undefined && y !== undefined ? `:${x}:${y}` : "";
        return this.addVideoFilter(`crop=${width}:${height}${position}`);
    }
    scale(width, height = -1) {
        return this.addVideoFilter(`scale=${width}:${height}`);
    }
    // Audio filters
    addAudioFilter(filter) {
        this.audioFilters.push(filter);
        return this;
    }
    setVolume(volume) {
        return this.addAudioFilter(`volume=${volume}`);
    }
    // Image sequence options
    setImageSequence(frameRate) {
        this.loop = 1;
        this.fps = frameRate;
        return this;
    }
    // Metadata
    addMetadata(key, value) {
        this.metadata[key] = value;
        return this;
    }
    addOption(option) {
        this.additionalOptions.push(option);
        return this;
    }
    build() {
        const commands = [];
        // Add input options
        if (this.seekTime) {
            commands.push("-ss", this.seekTime);
        }
        // Add input
        commands.push("-i", "{{in1}}");
        // Add duration
        if (this.duration) {
            commands.push("-t", this.duration);
        }
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
        // Add preset
        if (this.preset) {
            commands.push("-preset", this.preset);
        }
        // Add CRF
        if (this.crf !== undefined) {
            commands.push("-crf", this.crf.toString());
        }
        // Add threads
        if (this.threads !== undefined) {
            commands.push("-threads", this.threads.toString());
        }
        // Add loop for image sequence
        if (this.loop !== undefined) {
            commands.push("-loop", this.loop.toString());
        }
        // Add video filters
        if (this.videoFilters.length > 0) {
            commands.push("-vf", this.videoFilters.join(","));
        }
        // Add audio filters
        if (this.audioFilters.length > 0) {
            commands.push("-af", this.audioFilters.join(","));
        }
        // Add metadata
        for (const [key, value] of Object.entries(this.metadata)) {
            commands.push("-metadata", `${key}=${value}`);
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
}
exports.FFmpegCommandBuilder = FFmpegCommandBuilder;
