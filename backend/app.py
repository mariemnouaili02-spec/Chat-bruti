from flask import Flask, jsonify, request
from datetime import datetime


def _now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def create_app():
    app = Flask(__name__)

    # simple in-memory storage for demonstration
    app.config.setdefault("MESSAGES", [
        {"id": 1, "author": "system", "text": "Welcome to Chat-bruti!", "created_at": _now_iso()}
    ])

    def _next_id():
        msgs = app.config["MESSAGES"]
        return max((m["id"] for m in msgs), default=0) + 1

    def _find_message(msg_id: int):
        return next((m for m in app.config["MESSAGES"] if m["id"] == msg_id), None)

    def _remove_message(msg_id: int) -> bool:
        msgs = app.config["MESSAGES"]
        for i, m in enumerate(msgs):
            if m["id"] == msg_id:
                del msgs[i]
                return True
        return False

    @app.route("/")
    def index():
        return jsonify(message="Hello from Chat-bruti backend!")

    @app.route("/api/v1/health")
    def health():
        return jsonify(status="ok")

    @app.route("/api/v1/messages", methods=["GET"])
    def list_messages():
        msgs = app.config["MESSAGES"]

        # filtering
        author = request.args.get("author")
        q = request.args.get("q")
        if author:
            msgs = [m for m in msgs if m.get("author") == author]
        if q:
            ql = q.lower()
            msgs = [m for m in msgs if ql in m.get("text", "").lower()]

        # pagination
        try:
            limit = int(request.args.get("limit", 100))
            offset = int(request.args.get("offset", 0))
        except ValueError:
            return jsonify(error="limit and offset must be integers"), 400

        total = len(msgs)
        sliced = msgs[offset: offset + limit]
        return jsonify(messages=sliced, meta={"total": total, "limit": limit, "offset": offset})

    @app.route("/api/v1/messages", methods=["POST"])
    def create_message():
        if not request.is_json:
            return jsonify(error="JSON body required"), 400
        data = request.get_json()
        text = data.get("text")
        author = data.get("author", "anonymous")
        if not text:
            return jsonify(error="'text' is required"), 400
        msg = {"id": _next_id(), "author": author, "text": text, "created_at": _now_iso()}
        app.config["MESSAGES"].append(msg)
        return jsonify(message=msg), 201


    @app.route("/api/v1/messages/<int:msg_id>", methods=["GET"])
    def get_message(msg_id: int):
        msg = _find_message(msg_id)
        if msg is None:
            return jsonify(error="message not found"), 404
        return jsonify(message=msg)


    @app.route("/api/v1/messages/<int:msg_id>", methods=["PUT", "PATCH"])
    def update_message(msg_id: int):
        msg = _find_message(msg_id)
        if msg is None:
            return jsonify(error="message not found"), 404
        if not request.is_json:
            return jsonify(error="JSON body required"), 400
        data = request.get_json()
        text = data.get("text")
        author = data.get("author")
        updated = False
        if text is not None:
            msg["text"] = text
            updated = True
        if author is not None:
            msg["author"] = author
            updated = True
        if updated:
            msg["updated_at"] = _now_iso()
        return jsonify(message=msg)


    @app.route("/api/v1/messages/<int:msg_id>", methods=["DELETE"])
    def delete_message(msg_id: int):
        ok = _remove_message(msg_id)
        if not ok:
            return jsonify(error="message not found"), 404
        return ("", 204)

    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=5000, debug=True)
