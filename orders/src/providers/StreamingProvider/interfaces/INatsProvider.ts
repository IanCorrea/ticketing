export default interface INatsProvider {
  connect(clusterId: string, clientId: string, url: string): void;
}
