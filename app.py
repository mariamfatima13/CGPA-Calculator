from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()
    semesters = data.get("semesters", [])

    try:
        total_weighted_gpa = 0
        total_credit_hours = 0

        for sem in semesters:
            gpa = float(sem["gpa"])
            credit = float(sem["credit"])

            if gpa < 0 or gpa > 4 or credit <= 0:
                return jsonify({"error": "Invalid GPA or Credit Hours"}), 400

            total_weighted_gpa += gpa * credit
            total_credit_hours += credit

        if total_credit_hours == 0:
            return jsonify({"error": "Total credit hours cannot be zero"}), 400

        cgpa = total_weighted_gpa / total_credit_hours
        return jsonify({"cgpa": round(cgpa, 3)})

    except Exception as e:
        return jsonify({"error": "Invalid input format"}), 400

if __name__ == "__main__":
    app.run(debug=True)

