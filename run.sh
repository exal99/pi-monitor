export FLASK_ENV=production
cd static
npm run build
cd ..
. venv/bin/activate
python app.py > /dev/null 2>&1 &