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
export declare class FFMPEGClient {
    private baseUrl;
    private apiToken;
    constructor(baseUrl: string, apiToken: string);
    private getHeaders;
    executeCommand(command: CommandOutput): Promise<FFMPEGResponse>;
    getJobStatus(uuid: string): Promise<JobStatus>;
    createCommand(): FFmpegCommandBuilder;
}
declare class FFmpegCommandBuilder {
    private inputPath;
    private outputPath;
    private videoCodec?;
    private audioCodec?;
    private videoBitrate?;
    private audioBitrate?;
    private size?;
    private fps?;
    private additionalOptions;
    private client;
    constructor(client: FFMPEGClient);
    input(path: string): FFmpegCommandBuilder;
    output(path: string): FFmpegCommandBuilder;
    setVideoCodec(codec: string): FFmpegCommandBuilder;
    setAudioCodec(codec: string): FFmpegCommandBuilder;
    setVideoBitrate(bitrate: string): FFmpegCommandBuilder;
    setAudioBitrate(bitrate: string): FFmpegCommandBuilder;
    setSize(size: string): FFmpegCommandBuilder;
    setFPS(fps: number): FFmpegCommandBuilder;
    addOption(option: string): FFmpegCommandBuilder;
    private build;
    execute(): Promise<FFMPEGResponse>;
    executeAndWait(pollInterval?: number, timeout?: number): Promise<JobStatus>;
}
export {};
