interface CommandOutput {
  ffmpeg_command: string;
  input_files: {
    [key: string]: string;
  };
  output_files: {
    [key: string]: string;
  };
}

export class FFmpegCommandBuilder {
  private inputPath: string = "";
  private outputPath: string = "";
  private videoCodec?: string;
  private audioCodec?: string;
  private videoBitrate?: string;
  private audioBitrate?: string;
  private size?: string;
  private fps?: number;
  private videoFilters: string[] = [];
  private audioFilters: string[] = [];
  private seekTime?: string;
  private duration?: string;
  private preset?: string;
  private crf?: number;
  private threads?: number;
  private loop?: number;
  private metadata: Record<string, string> = {};
  private additionalOptions: string[] = [];

  input(path: string): FFmpegCommandBuilder {
    this.inputPath = path;
    return this;
  }

  output(path: string): FFmpegCommandBuilder {
    this.outputPath = path;
    return this;
  }

  // Video encoding options
  setVideoCodec(codec: string): FFmpegCommandBuilder {
    this.videoCodec = codec;
    return this;
  }

  setAudioCodec(codec: string): FFmpegCommandBuilder {
    this.audioCodec = codec;
    return this;
  }

  setVideoBitrate(bitrate: string): FFmpegCommandBuilder {
    this.videoBitrate = bitrate;
    return this;
  }

  setAudioBitrate(bitrate: string): FFmpegCommandBuilder {
    this.audioBitrate = bitrate;
    return this;
  }

  setSize(size: string): FFmpegCommandBuilder {
    this.size = size;
    return this;
  }

  setFPS(fps: number): FFmpegCommandBuilder {
    this.fps = fps;
    return this;
  }

  // Advanced encoding options
  setPreset(preset: string): FFmpegCommandBuilder {
    this.preset = preset;
    return this;
  }

  setCRF(crf: number): FFmpegCommandBuilder {
    this.crf = crf;
    return this;
  }

  setThreads(threads: number): FFmpegCommandBuilder {
    this.threads = threads;
    return this;
  }

  // Time-related options
  setSeek(time: string): FFmpegCommandBuilder {
    this.seekTime = time;
    return this;
  }

  setDuration(duration: string): FFmpegCommandBuilder {
    this.duration = duration;
    return this;
  }

  // Video filters
  addVideoFilter(filter: string): FFmpegCommandBuilder {
    this.videoFilters.push(filter);
    return this;
  }

  rotate(degrees: number): FFmpegCommandBuilder {
    return this.addVideoFilter(`rotate=${degrees}*PI/180`);
  }

  crop(
    width: number,
    height: number,
    x?: number,
    y?: number
  ): FFmpegCommandBuilder {
    const position = x !== undefined && y !== undefined ? `:${x}:${y}` : "";
    return this.addVideoFilter(`crop=${width}:${height}${position}`);
  }

  scale(
    width: number | string,
    height: number | string = -1
  ): FFmpegCommandBuilder {
    return this.addVideoFilter(`scale=${width}:${height}`);
  }

  // Audio filters
  addAudioFilter(filter: string): FFmpegCommandBuilder {
    this.audioFilters.push(filter);
    return this;
  }

  setVolume(volume: number): FFmpegCommandBuilder {
    return this.addAudioFilter(`volume=${volume}`);
  }

  // Image sequence options
  setImageSequence(frameRate: number): FFmpegCommandBuilder {
    this.loop = 1;
    this.fps = frameRate;
    return this;
  }

  // Metadata
  addMetadata(key: string, value: string): FFmpegCommandBuilder {
    this.metadata[key] = value;
    return this;
  }

  addOption(option: string): FFmpegCommandBuilder {
    this.additionalOptions.push(option);
    return this;
  }

  build(): CommandOutput {
    const commands: string[] = [];

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
