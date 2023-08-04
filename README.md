# ticket-reservation-nestjs
콘서트 티켓 예매 서비스

---
### ERD
![image](https://github.com/newsuperfi/nbc-ticket-reservation-nestjs/assets/122774009/d8643068-8a92-471f-b9fa-a1ade921eb72)

### API
|Content|Method|path|-|
|----|----|-----|---|
|로그인|POST|/users/login|
|회원가입|POST|/users/signup|
|프로필조회|GET|/users/profile|Authorization|
|공연 등록|POST|/concerts/registration|admin|
|공연 일정 등록|POST|/concerts/registration/dates/:concertId|admin|
|공연 목록 조회|GET|/concerts/list|
|공연 상세 조회|GET|/concerts/detail/:concertId|
|공연 검색|GET|/concert/search/:keyword|
|공연 예매|POST|/reservation|Authorization|
|예매 목록 확인|GET|/reservation/list|Authorization|
