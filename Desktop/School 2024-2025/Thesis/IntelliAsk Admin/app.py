from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Dummy in-memory database
data = {
    "programs": [],
    "faculty": [],
    "events": []
}

@app.route('/')
def admin_dashboard():
    return render_template('admin_dashboard.html', data=data)

@app.route('/add_program', methods=['POST'])
def add_program():
    program = request.form['program_name']
    data['programs'].append(program)
    return redirect(url_for('admin_dashboard'))

if __name__ == '__main__':
    app.run(debug=True)
