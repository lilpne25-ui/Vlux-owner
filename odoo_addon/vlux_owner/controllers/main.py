import json

from odoo import http
from odoo.exceptions import AccessError
from odoo.http import Response, request
from odoo.tools import file_open


class VluxOwnerController(http.Controller):

    def _ensure_owner_access(self):
        if not request.env.user.has_group("vlux_owner.group_vlux_owner"):
            raise AccessError("Tu usuario no tiene acceso a VLUX Owner.")

    @http.route("/vlux-owner", type="http", auth="user", methods=["GET"], sitemap=False)
    def owner_redirect(self, **kwargs):
        return request.redirect("/vlux-owner/")

    @http.route("/vlux-owner/", type="http", auth="user", methods=["GET"], sitemap=False)
    def owner_app(self, **kwargs):
        self._ensure_owner_access()
        return request.render("vlux_owner.owner_app")

    @http.route("/vlux_owner/api/dashboard", type="jsonrpc", auth="user", methods=["POST"], readonly=True)
    def dashboard(self, date=None, **kwargs):
        self._ensure_owner_access()
        return request.env["vlux.owner.dashboard.service"].get_dashboard(date=date)

    @http.route("/vlux-owner/manifest.webmanifest", type="http", auth="public", methods=["GET"], sitemap=False)
    def manifest(self, **kwargs):
        payload = {
            "name": "VLUX Owner",
            "short_name": "VLUX Owner",
            "description": "Tu negocio en la palma de tu mano.",
            "start_url": "/vlux-owner/",
            "scope": "/vlux-owner/",
            "display": "standalone",
            "background_color": "#09080e",
            "theme_color": "#0d0a14",
            "icons": [
                {"src": "/vlux_owner/static/img/icon-192.png", "sizes": "192x192", "type": "image/png"},
                {"src": "/vlux_owner/static/img/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
            ],
        }
        return Response(json.dumps(payload), content_type="application/manifest+json")

    @http.route("/vlux-owner/sw.js", type="http", auth="public", methods=["GET"], sitemap=False)
    def service_worker(self, **kwargs):
        with file_open("vlux_owner/static/src/sw.js", "rb") as stream:
            content = stream.read()
        response = Response(content, content_type="application/javascript")
        response.headers["Service-Worker-Allowed"] = "/vlux-owner/"
        response.headers["Cache-Control"] = "no-cache"
        return response
