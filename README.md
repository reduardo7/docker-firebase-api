# Docker Firebase API

## Docker

https://hub.docker.com/r/reduardo7/firebase-api

```bash
docker pull reduardo7/firebase-api
```

## Setup

1. Generate your `service-account.json` from _Firebase Console_.
2. Copy `service-account.json` to `/app/service-account.json`.

## Firebase Service Account

Go to "https://console.firebase.google.com/u/5/project/YOUR_PROJECT_ID/settings/serviceaccounts/adminsdk" and generate your `service-account.json`.

### Dockerfile Example

```Dockerfile
FROM reduardo7/firebase-api
ENV PROJECT_ID yourProjectId
COPY service-account.json /app/service-account.json
```

## Usage Example

Start server using:

```bash
docker-compose up
```

### Bash

```bash
server="http://localhost:3000"
topic="topic"
title="The+title"
message="The+message"
url="$server/message/$topic/$title/$message"

curl "$url"
```

### PHP

```php
class FirebaseUtils {
  const TOPIC_DEPOSIT = 'topic';
  const FIREBASE_SERVER = 'http://localhost:3000';

  public static function sendMessage($topic, $title, $message) {
    $server = FIREBASE_SERVER;
    $topic = urlencode($topic);
    $title = urlencode($title);
    $message = urlencode($message);
    $url = "$server/message/$topic/$title/$message";

    return file_get_contents($url);
  }
}

FirebaseUtils::sendMessage(FirebaseUtils::TOPIC_DEPOSIT, 'The title', 'The message');
```
