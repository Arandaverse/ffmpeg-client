interface CommandOutput {
  ffmpeg_command: string;
  input_files: {
    [key: string]: string;
  };
  output_files: {
    [key: string]: string;
  };
}

interface FFMPEGResponse {
  uuid: string;
  status: string;
}

interface OutputFileMetadata {
  file_format: string;
  file_id: string;
  file_type: string;
  height: number;
  size_mbytes: number;
  storage_url: string;
  width: number;
}

interface JobStatus {
  uuid: string;
  status: "pending" | "processing" | "completed" | "failed";
  result?: string;
  progress: number;
  error?: string;
  created_at: string;
  updated_at: string;
  output_files?: {
    [key: string]: OutputFileMetadata;
  };
}

export class FFMPEGClient {
  private baseUrl: string;
  private apiToken: string;

  constructor(baseUrl: string, apiToken: string) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.apiToken = apiToken;
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "X-API-Token": this.apiToken,
    };
  }

  async executeCommand(command: CommandOutput): Promise<FFMPEGResponse> {
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

  async getJobStatus(uuid: string): Promise<JobStatus> {
    const response = await fetch(`${this.baseUrl}/ffmpeg/progress/${uuid}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  createCommand(): FFmpegCommandBuilder {
    return new FFmpegCommandBuilder(this);
  }
}

class FFmpegCommandBuilder {
  private inputPath: string = "";
  private outputPath: string = "";
  private videoCodec?: string;
  private audioCodec?: string;
  private videoBitrate?: string;
  private audioBitrate?: string;
  private size?: string;
  private fps?: number;
  private additionalOptions: string[] = [];
  private client: FFMPEGClient;

  constructor(client: FFMPEGClient) {
    this.client = client;
  }

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

  private build(): CommandOutput {
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

  async execute(): Promise<FFMPEGResponse> {
    const command = this.build();
    return this.client.executeCommand(command);
  }

  async executeAndWait(
    pollInterval = 1000,
    timeout = 300000
  ): Promise<JobStatus> {
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
