package co.airy.kafka.streams;

public class HostStoreInfo {
    private String host;
    private int port;

    HostStoreInfo(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    boolean isLocalStore(final String localHost, final int localPort) {
        return getHost().equals(localHost) && getPort() == localPort;
    }
}
