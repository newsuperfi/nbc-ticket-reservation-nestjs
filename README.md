# ticket-reservation-nestjs
콘서트 티켓 예매 서비스

---
## ERD
![image](https://github.com/newsuperfi/nbc-ticket-reservation-nestjs/assets/122774009/d8643068-8a92-471f-b9fa-a1ade921eb72)

## API
|Content|Method|path|-|
|----|----|-----|---|
|로그인|POST|/users/login|
|회원가입|POST|/users/signup|
|프로필조회|GET|/users/profile|Authorization|
|공연 등록|POST|/concerts/registration|admin|
|공연 일정 등록|POST|/concerts/registration/dates/:concertId|admin|
|공연별 좌석 등록|POST|/concerts/seatsetting|admin|
|공연 목록 조회|GET|/concerts/list|
|공연 상세 조회|GET|/concerts/detail/:concertId|
|공연 검색|GET|/concert/search/:keyword|
|공연 예매|POST|/reservation|Authorization|
|예매 목록 확인|GET|/reservation/list|Authorization|

---
## 작업기간
23.07.31 ~ 23.08.04

---
## 개발 환경
- NestJS / TypeScript
- MySQL / TypeORM

---
## 주요 기능
### 회원가입 / 로그인
- bcrypt 모듈 사용으로 회원가입 시 비밀번호 암호화 및 로그인 시 비밀번호 비교
- 로그인 시 JWT 토큰 발급 및 passport-jwt모듈을 통한 인증(AuthGuard)

### 공연 등록
- 회원정보 내 is_admin 컬럼이 true인 관리자만 공연 정보 및 일정 등록 가능
- 공연정보 등록 후 concert_dates 테이블에 상세 공연 일정 등록 가능
   - [
  {"date": "2023-08-23 18:00"},
  {"date": "2023-08-24 18:00"},
  {"date": "2023-08-25 18:00"}
]
- 공연 별 좌석 상황이 상이할 수 있기에 관리자가 공연 등록 시 좌석정보 수동 입력
  - { "row": "A", "column": "7", "concertId": "8", "concertDateId": "17" }
  - row에 열, column에 끝자리 좌석번호를 입력하면 1개 열씩 입력 가능
 

### 예매 및 취소
- 원하는 공연, 시간, 좌석 선택 후 예매 가능
  - {
  "concertId": "2",
  "concertDateId": "10",
  "seatId": [31, 32]
} 
  - 예약 성공 시 해당 좌석은 state가 'booked'상태로 변하여 다른 사람이 예매할 수 없음
  - 취소 시 다시 state를 'unbooked'로 변환
- 공연 시작 3시간 전까지만 예매 취소 가능
