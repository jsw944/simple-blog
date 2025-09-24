
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// EJS를 뷰 엔진으로 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공 (CSS, JS, 이미지 등)
app.use(express.static(path.join(__dirname, 'public')));

// URL-encoded body 파서
app.use(express.urlencoded({ extended: true }));

// 데이터 로드
const inquiriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/inquiries.json'), 'utf-8'));

// 라우트 설정
// 홈페이지
app.get('/', (req, res) => {
    res.render('index', { title: '홈' });
});

// 문의 내역 보기 페이지 (검색 기능 포함)
app.get('/inquiries', (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    let filteredInquiries = inquiriesData;

    if (query) {
        filteredInquiries = inquiriesData.filter(inquiry => 
            inquiry.title.toLowerCase().includes(query) || 
            inquiry.content.toLowerCase().includes(query) ||
            inquiry.author.toLowerCase().includes(query)
        );
    }

    res.render('inquiries', { title: '문의 내역', inquiries: filteredInquiries, query: req.query.q });
});

// 문의 상세보기 페이지
app.get('/inquiries/:id', (req, res) => {
    const inquiryId = parseInt(req.params.id, 10);
    const inquiry = inquiriesData.find(i => i.id === inquiryId);

    if (inquiry) {
        res.render('inquiry', { title: inquiry.title, inquiry: inquiry });
    } else {
        res.status(404).send('페이지를 찾을 수 없습니다.');
    }
});

// 회사 소개 페이지
app.get('/about', (req, res) => {
    res.render('about', { title: '회사 소개' });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
