FROM nathansamson/flutter-builder-docker

WORKDIR /home/area_app

COPY . .

RUN flutter upgrade

CMD yes y | flutter doctor --android-licenses && flutter packages get -v && flutter build apk && cp -rf /home/area_app/build/app/outputs/apk/release/app-release.apk /home/area_app/apk/client.apk && sleep 30
