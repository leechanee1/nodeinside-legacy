# nodeinside-legacy
nodeinside-legacy는 [nodeinside](https://github.com/leechanee1/nodeinside)의 구형 버전입니다. 디시인사이드의 모바일 웹을 이용하여 작동하며, 글 쓰기와 이미지 첨부, 로그인만 가능합니다. 공부 목적을 위해 git 및 npm에 배포하며 실제 사용은 [nodeinside](https://github.com/leechanee1/nodeinside)를 권장합니다.

##설치
```
# 김청하 솔로대박 기원
$ npm install --save nodeinside-legacy

let dcinside = require('nodeinside-legacy');
```

##기능
nodeinside-legacy의 모든 method는 **Promise**를 반환합니다.
동기적으로 사용하려면 **co** 모듈을 사용하세요.

###로그인 세션
로그인 성공 시 로그인 세션을 반환(resolve)합니다.
```
dcinside.session.login(user_id, user_pw).then(session => { ... });
```

###게시글 작성
글 작성이 성공하면 글 번호 및 결과를 반환합니다.
```
dcinside.article.write(session, gall_id, subject, content, fl_data, ofl_data).then(data => { console.log(data); });
// { result: true, cause: '123456' }
```

###이미지 업로드
이미지 업로드에 성공하면 게시글 작성시 사용되는 fl_data, ofl_data, result를 반환합니다.
```
dcinside.article.upload(gall_id, images).then(data => { console.log(data); });
// { result: true, fl_data: ..., ofl_data: ... }
```

#아무말 대잔치
**김청하 솔로대박 기원**

##Licence
MIT
