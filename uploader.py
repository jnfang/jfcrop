from flask import Flask,request, session, g, redirect, url_for, \
     abort,  render_template, flash, send_from_directory
from flask import g
from werkzeug import secure_filename
from flask import send_from_directory
import logging

# sets name of folder to send image and allowed formats
UPLOAD_FOLDER = 'uploaded_pics/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'jpeg'])
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)

# route where uploaded pics will go
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
log = logging.getLogger(__name__)

# uncomment below to limit size of upload
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 

# send javascript
@app.route('/scripts/<path:filename>')
def send_js(filename):
    return send_from_directory('scripts/', filename)

# send imageAreaSelect
@app.route('/jquery_imageAreaSelect/<path:filename>')
def send_jquery(filename):
    return send_from_directory('jquery_imageAreaSelect/', filename)

# send CSS
@app.route('/jquery_imageAreaSelect/css/<path:filename>')
def send_css(filename):
    return send_from_directory('jquery_imageAreaSelect/css/', filename)

# checks if uploaded file has one of allowed extensions
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

# secures uploaded file's name, escapes attacks
@app.route('/', methods=['GET', 'POST'])
def upload_file():
    # handles the post request from jkcrop plugin
    if request.method == 'POST':
        myfile = (dict(request.files)['img'])[0]
        if myfile and allowed_file(myfile.filename):
            filename = secure_filename(myfile.filename)
            myfile.save("uploaded_pics/" + filename)
            return "upload successful"

        # uncomment below to if post is sending dataURL or the link
        # filedata = request.json
        # filename = "test.jpeg"# name it something, perhaps the username?
        # filepath =os.path.join(app.config['UPLOAD_FOLDER'], filename)
        # with open(filepath,'wb') as imgfile:
        #     imgfile.write(base64.decodestring(request.data))
        # return json.dumps(filedata)
   
    return render_template('uploader.html')


if __name__ == "__main__":
    app.run(debug=True)