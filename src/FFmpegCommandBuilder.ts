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
  private additionalOptions: string[] = [];

  input(path: string): FFmpegCommandBuilder {
    this.inputPath = path;
    return this;
  }

  output(path: string): FFmpegCommandBuilder {
    this.outputPath = path;
    return this;
  }

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

  addOption(option: string): FFmpegCommandBuilder {
    this.additionalOptions.push(option);
    return this;
  }

  build(): CommandOutput {
    const commands: string[] = [];

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
}
