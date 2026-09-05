import http.server
import ssl

PORT = 8443

server_address = ("0.0.0.0", PORT)

httpd = http.server.HTTPServer(
    server_address,
    http.server.SimpleHTTPRequestHandler
)

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)

context.load_cert_chain(
    certfile="10.231.74.53+2.pem",
    keyfile="10.231.74.53+2-key.pem"
)

httpd.socket = context.wrap_socket(
    httpd.socket,
    server_side=True
)

print("====================================")
print("     SIGNALSAFE HTTPS SERVER")
print("====================================")
print("Open on PC:")
print("https://localhost:8443")
print("")
print("Open on Phone:")
print("https://10.231.74.53:8443")
print("====================================")

httpd.serve_forever()