interface CommandOutput {
    ffmpeg_command: string;
    input_files: {
        [key: string]: string;
    };
    output_files: {
        [key: string]: string;
    };
}
export declare class FFmpegCommandBuilder {
    private inputPath;
    private outputPath;
    private videoCodec?;
    private audioCodec?;
    private videoBitrate?;
    private audioBitrate?;
    private size?;
    private fps?;
    private videoFilters;
    private audioFilters;
    private seekTime?;
    private duration?;
    private preset?;
    private crf?;
    private threads?;
    private loop?;
    private metadata;
    private additionalOptions;
    input(path: string): FFmpegCommandBuilder;
    output(path: string): FFmpegCommandBuilder;
    setVideoCodec(codec: string): FFmpegCommandBuilder;
    setAudioCodec(codec: string): FFmpegCommandBuilder;
    setVideoBitrate(bitrate: string): FFmpegCommandBuilder;
    setAudioBitrate(bitrate: string): FFmpegCommandBuilder;
    setSize(size: string): FFmpegCommandBuilder;
    setFPS(fps: number): FFmpegCommandBuilder;
    setPreset(preset: string): FFmpegCommandBuilder;
    setCRF(crf: number): FFmpegCommandBuilder;
    setThreads(threads: number): FFmpegCommandBuilder;
    setSeek(time: string): FFmpegCommandBuilder;
    setDuration(duration: string): FFmpegCommandBuilder;
    addVideoFilter(filter: string): FFmpegCommandBuilder;
    rotate(degrees: number): FFmpegCommandBuilder;
    crop(width: number, height: number, x?: number, y?: number): FFmpegCommandBuilder;
    scale(width: number | string, height?: number | string): FFmpegCommandBuilder;
    addAudioFilter(filter: string): FFmpegCommandBuilder;
    setVolume(volume: number): FFmpegCommandBuilder;
    setImageSequence(frameRate: number): FFmpegCommandBuilder;
    addMetadata(key: string, value: string): FFmpegCommandBuilder;
    addOption(option: string): FFmpegCommandBuilder;
    build(): CommandOutput;
}
export {};
