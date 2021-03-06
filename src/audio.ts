export default class {
  private audioContext: AudioContext;

  public bassSourceBuffer;
  public snareSourceBuffer;

  constructor(sourceUrlList) {
    this.audioContext = new AudioContext();
    this.setupSources(sourceUrlList)
        .catch((error) => console.error(error));
  }

  async setupSources(sourceUrlList): Promise<any> {
    this.bassSourceBuffer = await this.fetchSourceBuffer(sourceUrlList.bassSource);
    this.snareSourceBuffer = await this.fetchSourceBuffer(sourceUrlList.snareSource);
  }

  play(source: AudioBufferSourceNode) {
    source.start(0);
  }

  createSource(buffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    return source;
  }

  async fetchSourceBuffer(url) {
    const buffer: ArrayBuffer = await this.downloadAudioBuffer(url) as ArrayBuffer;
    return await this.audioContext.decodeAudioData(buffer)
        .then((decoded) => {
          return decoded;
        })
        .catch((error) => {
          console.error('failed decode', error);
        });
  }

  async downloadAudioBuffer(url) {
    return await fetch(url)
        .then((response) => {
          return response.arrayBuffer();
        })
        .catch((error) => {
          console.error(error);
        });
  }
}
