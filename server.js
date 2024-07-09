require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./src/store/User');
const Counter = require('./src/store/Counter');
const MyRecipe = require('./src/models/MyRecipe');
const likeRoutes = require('./src/routes/likeRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const webzineLikeRoutes = require('./src/routes/webzineRoutes');
const Feed = require('./src/store/Feed');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Storage } = require('@google-cloud/storage');
const cookieParser = require('cookie-parser');
const fs = require('fs').promises;
const realFs = require('fs');
const app = express();
const port = process.env.PORT || 8080;
const apiUrl = process.env.REACT_APP_API_URL;
const OpenAIApi = require('openai');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
    origin: `${apiUrl}`,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

mongoose
    .connect(
        'mongodb+srv://ohtail:wCvHp9yQNPDK7wOp@cluster0.yzwdj7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        {}
    )
    .then(() => console.log('MongoDB 연결 성공'))
    .catch((err) => console.error('MongoDB 연결 실패:', err));

// OpenAI API 설정
const openai = new OpenAIApi({
    apiKey: process.env.REACT_APP_CHATBOT_API_KEY,
});

// 챗봇 엔드포인트
app.post('/chatbot', async (req, res) => {
    const userPrompt = req.body.userPrompt;
    const roleBasedProppt = '당신은 고객님들을 위한 친절한 바텐더입니다.';
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: roleBasedProppt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 100,
        });

        console.log(response.choices[0].message.content);
        res.send(response.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI API 호출 오류:', error);
        res.status(500).json({ message: 'OpenAI API 호출 중 오류가 발생했습니다.' });
    }
});

// Google Cloud Storage 설정
const storage = new Storage({
    keyFilename: path.join(__dirname, 'vertical-set-428902-u5-78e087eb934e.json'),
    projectId: 'vertical-set-428902-u5',
});

const bucket = storage.bucket('ohtail');

const generateAccessToken = (userid) => {
    return jwt.sign({ userid }, 'your_secret_key', { expiresIn: '3h' });
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploadsMyRecipe', express.static(path.join(__dirname, 'uploadsMyRecipe')));
app.use('/webzineUploads', express.static(path.join(__dirname, 'webzineUploads')));

app.use('/likes', likeRoutes);
app.use('/comments', commentRoutes);
app.use('/webzineLike', webzineLikeRoutes);

const Webzine = require('./src/models/Webzine');
const Favorite = require('./src/models/Favorite'); // Favorite 모델 불러오기

// 사용자 인증 미들웨어
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], 'your_secret_key');
        req.user = decoded;
        console.log('Decoded token:', decoded);
        next();
    } catch (error) {
        console.error('토큰 인증 실패:', error);
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

// 이메일 중복 확인 API
app.post('/api/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: '이미 사용중인 이메일입니다!' });
        }

        res.status(200).json({ message: '사용 가능한 이메일입니다!' });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 닉네임 중복 확인 API
app.post('/api/check-nickname', async (req, res) => {
    try {
        const { nickname } = req.body;
        const existingUser = await User.findOne({ nickname });
        if (existingUser) {
            return res.status(400).json({ message: '이미 존재하는 닉네임입니다!' });
        }
        res.status(200).json({ message: '사용 가능한 닉네임입니다!' });
    } catch (error) {
        console.error('Error checking nickname:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 회원가입
app.post('/signup', async (req, res) => {
    const {
        userid,
        password,
        email,
        phonenumber,
        nickname,
        drinkingFrequency,
        preferredIngredients,
        preferredAlcoholLevel,
    } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('해싱된 비밀번호:', hashedPassword);

        const counter = await Counter.findByIdAndUpdate(
            { _id: 'userId' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );

        const newUser = new User({
            userid: counter.sequence_value,
            password: hashedPassword,
            email,
            phonenumber,
            nickname,
            drinkingFrequency,
            preferredIngredients,
            preferredAlcoholLevel,
        });

        await newUser.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({
            success: false,
            message: '회원가입 중 오류가 발생했습니다.',
            error: error.message,
        });
    }
});

// 로그인
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('로그인 요청 받음:', { email, password });

        const user = await User.findOne({ email });
        console.log('사용자 찾기 결과:', user);

        if (!user) {
            console.log('사용자를 찾을 수 없습니다:', email);
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('비밀번호 비교 결과:', passwordMatch);

        if (passwordMatch) {
            console.log('로그인 성공:', email);
            const token = generateAccessToken(user.userid);
            res.status(200).json({
                message: '로그인 성공',
                token,
                userid: user.userid,
                nickname: user.nickname,
            });
        } else {
            console.log('비밀번호가 일치하지 않습니다:', email);
            res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
});

// 특정 유저 정보 가져오기
app.get('/user/:id', authenticateJWT, async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10); // 숫자로 변환
        console.log(`유저 정보 요청 받음: ${userId}`);
        const user = await User.findOne({ userid: userId }).select('nickname');
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('사용자 정보 불러오기 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 닉네임 업데이트
app.put('/user/:id/nickname', authenticateJWT, async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10); // 숫자로 변환
        const { nickname } = req.body;

        const user = await User.findOneAndUpdate({ userid: userId }, { nickname }, { new: true });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.status(200).json({
            message: '닉네임이 성공적으로 업데이트되었습니다.',
            nickname: user.nickname,
        });
    } catch (error) {
        console.error('닉네임 업데이트 오류:', error);
        res.status(500).json({ message: '닉네임 업데이트 중 오류가 발생했습니다.' });
    }
});

// 즐겨찾기 추가
app.post('/favorite', authenticateJWT, async (req, res) => {
    try {
        const { cocktailId, userId, isExternal } = req.body;
        if (!cocktailId || !userId) {
            return res.status(400).json({ message: 'cocktailId와 userId가 필요합니다.' });
        }

        const existingFavorite = await Favorite.findOne({
            userId,
            cocktailId,
            isExternal,
        });
        if (existingFavorite) {
            return res.status(400).json({ message: '이미 즐겨찾기된 레시피입니다.' });
        }

        const newFavorite = new Favorite({ userId, cocktailId, isExternal });
        await newFavorite.save();
        res.status(201).json(newFavorite);
    } catch (error) {
        console.error('즐겨찾기 추가 중 오류 발생:', error);
        res.status(500).json({ message: error.message });
    }
});

// 즐겨찾기 삭제
app.delete('/favorite', authenticateJWT, async (req, res) => {
    try {
        const { cocktailId, userId, isExternal } = req.body;
        if (!cocktailId || !userId) {
            return res.status(400).json({ message: 'cocktailId와 userId가 필요합니다.' });
        }

        await Favorite.findOneAndDelete({ userId, cocktailId, isExternal });
        res.status(200).json({ message: '즐겨찾기가 삭제되었습니다.' });
    } catch (error) {
        console.error('즐겨찾기 삭제 중 오류 발생:', error);
        res.status(500).json({ message: error.message });
    }
});

// 즐겨찾기 리스트
app.get('/favorites', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.userid;
        const favorites = await Favorite.find({ userId });
        res.status(200).json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: error.message });
    }
});

// 나만의 레시피 생성
const myRecipeUpload = multer({ storage: multer.memoryStorage() });

app.post('/createMyRecipe', authenticateJWT, myRecipeUpload.array('files', 3), async (req, res) => {
    try {
        const { title, description, instructions } = req.body;
        const files = req.files;
        const ingredients = [];
        const author = req.user.userid;

        // 사용자 닉네임 조회
        const user = await User.findOne({ userid: author });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        const authorNickname = user.nickname;

        console.log('Author:', author);
        console.log('Author Nickname:', authorNickname);

        for (let i = 0; req.body[`ingredient_${i}_name`]; i++) {
            ingredients.push({
                name: req.body[`ingredient_${i}_name`],
                quantity: req.body[`ingredient_${i}_quantity`],
                unit: req.body[`ingredient_${i}_unit`],
            });
        }

        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const blob = bucket.file(Date.now() + path.extname(file.originalname));
                const blobStream = blob.createWriteStream({
                    resumable: false,
                });

                await new Promise((resolve, reject) => {
                    blobStream.on('finish', resolve);
                    blobStream.on('error', reject);
                    blobStream.end(file.buffer);
                });

                return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            })
        );

        const myRecipe = new MyRecipe({
            title,
            description,
            files: uploadedFiles,
            ingredients,
            instructions,
            author,
            authorNickname,
        });

        await myRecipe.save();
        res.status(201).json(myRecipe);
    } catch (error) {
        console.error('레시피 생성 중 오류 발생:', error);
        res.status(500).json({ message: error.message });
    }
});

// 나만의 레시피 리스트
app.get('/myRecipe', async (req, res) => {
    try {
        const recipes = await MyRecipe.find().sort({ createdAt: -1 });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 나만의 레시피 상세
app.get('/myRecipe/:id', async (req, res) => {
    try {
        const myRecipe = await MyRecipe.findById(req.params.id);
        res.status(200).json(myRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 나만의 레시피 수정
app.put('/myRecipe/:id', authenticateJWT, myRecipeUpload.array('files', 3), async (req, res) => {
    try {
        const { title, description, instructions } = req.body;
        const newFiles = req.files;
        const existingFiles = JSON.parse(req.body.existingFiles);
        const removedFiles = JSON.parse(req.body.removedFiles);
        const ingredients = [];

        for (let i = 0; req.body[`ingredient_${i}_name`]; i++) {
            ingredients.push({
                name: req.body[`ingredient_${i}_name`],
                quantity: req.body[`ingredient_${i}_quantity`],
                unit: req.body[`ingredient_${i}_unit`],
            });
        }

        // 기존 파일에서 삭제된 파일 제외
        const updatedFiles = existingFiles.filter((file) => !removedFiles.includes(file));

        // 새 파일 업로드
        const uploadedNewFiles = await Promise.all(
            newFiles.map(async (file) => {
                const blob = bucket.file(Date.now() + path.extname(file.originalname));
                const blobStream = blob.createWriteStream({
                    resumable: false,
                });

                await new Promise((resolve, reject) => {
                    blobStream.on('finish', resolve);
                    blobStream.on('error', reject);
                    blobStream.end(file.buffer);
                });

                return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            })
        );

        const allFiles = [...updatedFiles, ...uploadedNewFiles];

        const updatedRecipe = {
            title,
            description,
            files: allFiles,
            ingredients,
            instructions,
        };

        const result = await MyRecipe.findByIdAndUpdate(req.params.id, updatedRecipe, { new: true });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 나만의 레시피 삭제
app.delete('/myRecipe/:id', authenticateJWT, async (req, res) => {
    try {
        await MyRecipe.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: '레시피가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 특정 사용자가 작성한 레시피 리스트
app.get('/myRecipeTab', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.userid;
        const recipes = await MyRecipe.find({ author: userId }).sort({
            createdAt: -1,
        });
        res.status(200).json(recipes);
    } catch (error) {
        console.error('레시피 불러오기 중 오류 발생:', error);
        res.status(500).json({ message: '레시피 불러오기 중 오류가 발생했습니다.' });
    }
});

// 웹진 업로드 설정
const webzineUpload = multer({ storage: multer.memoryStorage() });

// 웹진 생성
app.post('/webzineWrite', webzineUpload.single('files'), authenticateJWT, async (req, res) => {
    try {
        const { title, summary, content } = req.body;
        const file = req.file;

        const blob = bucket.file(Date.now() + path.extname(file.originalname));
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        await new Promise((resolve, reject) => {
            blobStream.on('finish', resolve);
            blobStream.on('error', reject);
            blobStream.end(file.buffer);
        });

        const coverUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        const webzineDoc = await Webzine.create({
            title,
            summary,
            content,
            cover: coverUrl,
            author: req.user.userid,
            nickname: '오테일',
        });
        res.json(webzineDoc);
    } catch (error) {
        console.error('웹진 생성 중 오류 발생:', error);
        res.status(500).json({ message: error.message });
    }
});

// 웹진 첫 진입 페이지
app.get('/webzine', async (req, res) => {
    try {
        const webzineData = await Webzine.find().sort({ createdAt: -1 });
        res.status(200).json(webzineData);
    } catch (error) {
        console.error('웹진 데이터 가져오기 오류:', error);
        res.status(500).json({ message: '웹진 데이터를 가져오는 중 오류가 발생했습니다.' });
    }
});

// 웹진 리스트
app.get('/webzineList', async (req, res) => {
    console.log('요청');
    const webzineList = await Webzine.find().sort({ createdAt: -1 });
    res.json(webzineList);
    console.log(webzineList);
});

// 웹진 상세
app.get('/webzineDetail/:id', async (req, res) => {
    const { id } = req.params;
    const webzineDoc = await Webzine.findById(id);
    res.json(webzineDoc);
});

// 웹진 삭제
app.delete('/delWebzine/:id', async (req, res) => {
    const { id } = req.params;
    await Webzine.findByIdAndDelete(id);
    res.json({ message: 'ok' });
});

// 웹진 수정 정보 가져오기
app.get('/webzineEdit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const webzineDoc = await Webzine.findById(id);
        if (!webzineDoc) {
            return res.status(404).json({ message: '웹진을 찾을 수 없습니다.' });
        }
        res.status(200).json(webzineDoc);
    } catch (error) {
        console.error('웹진 수정 상세 정보 가져오기 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 웹진 수정
app.put('/webzineEdit/:id', authenticateJWT, webzineUpload.single('files'), async (req, res) => {
    const { id } = req.params;
    let newPath = null;

    if (req.file) {
        const { originalname, buffer } = req.file;
        const blob = bucket.file(Date.now() + path.extname(originalname));
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        await new Promise((resolve, reject) => {
            blobStream.on('finish', resolve);
            blobStream.on('error', reject);
            blobStream.end(buffer);
        });

        newPath = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    }

    const { title, summary, content } = req.body;
    try {
        const webzineDoc = await Webzine.findById(id);
        if (!webzineDoc) {
            return res.status(404).json({ message: '웹진을 찾을 수 없습니다.' });
        }

        await Webzine.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            cover: newPath ? newPath : webzineDoc.cover,
        });

        res.json({ message: 'ok' });
    } catch (updateError) {
        console.error('Error updating webzine: ', updateError);
        res.status(500).json({ message: '웹진 업데이트 실패' });
    }
});

// 피드 업로드 설정
const feedUpload = multer({ storage: multer.memoryStorage() });

// 피드 생성
app.post(
    '/createFeed',
    authenticateJWT,
    feedUpload.single('imgFile'), // 기존 multer 설정 유지
    async (req, res) => {
        try {
            const { originalname, buffer } = req.file;

            const blob = bucket.file(Date.now() + path.extname(originalname));
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            await new Promise((resolve, reject) => {
                blobStream.on('finish', resolve);
                blobStream.on('error', reject);
                blobStream.end(buffer);
            });

            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            const { title, content } = req.body;

            // 작성자 정보 조회
            const user = await User.findOne({
                userid: req.user.userid,
            });
            if (!user) {
                return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            const newFeed = new Feed({
                title,
                content,
                cover: imageUrl, // cover 필드에 이미지 URL 저장
                author: req.user.userid, // 작성자 정보 추가 (userid 사용)
                authorNickname: user.nickname, // 작성자 닉네임 추가
            });

            await newFeed.save();

            res.status(200).json({ message: '피드가 성공적으로 생성되었습니다.', newFeed });
        } catch (error) {
            console.error('피드 생성 중 오류 발생:', error);
            res.status(500).json({ message: '피드 생성 중 오류가 발생했습니다.' });
        }
    }
);

// 피드 리스트
app.get('/feedList', async (req, res) => {
    try {
        const feedList = await Feed.find().sort({ createdAt: -1 });
        res.json(feedList);
    } catch (error) {
        console.error('피드 리스트를 가져오는 중 오류 발생:', error);
        res.status(500).json({ message: '피드 리스트를 가져오는 중 오류가 발생했습니다.' });
    }
});

app.get('/feedDetail/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let feed = await Feed.findById(id);
        if (!feed) {
            return res.status(404).json({ message: '피드를 찾을 수 없습니다.' });
        }

        const author = await User.findOne({ userid: feed.author });
        if (author) {
            feed = feed.toObject(); // feed 객체를 평범한 자바스크립트 객체로 변환
            feed.authorNickname = author.nickname; // 작성자 닉네임 추가
        }

        res.json(feed);
    } catch (error) {
        console.error('피드 상세 조회 중 오류 발생:', error);
        res.status(500).json({ message: '피드 상세 조회 중 오류가 발생했습니다.' });
    }
});

// 피드 삭제
app.delete('/feedDelete/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Feed.findByIdAndDelete(id);
    res.json({ message: 'ok' });
});

// 피드 수정
app.put('/feedEdit/:id', feedUpload.single('imgFile'), async (req, res) => {
    const { id } = req.params;

    try {
        let updatedFields = {};

        // 이미지 파일이 업로드된 경우
        if (req.file) {
            const { originalname, buffer } = req.file;

            const blob = bucket.file(Date.now() + path.extname(originalname));
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            await new Promise((resolve, reject) => {
                blobStream.on('finish', resolve);
                blobStream.on('error', reject);
                blobStream.end(buffer);
            });

            updatedFields.cover = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        }

        // 피드 제목과 내용 업데이트
        if (req.body.title) {
            updatedFields.title = req.body.title;
        }
        if (req.body.content) {
            updatedFields.content = req.body.content;
        }

        // 데이터베이스 업데이트
        const updatedFeed = await Feed.findByIdAndUpdate(id, updatedFields, {
            new: true,
        });

        if (!updatedFeed) {
            return res.status(404).json({ message: '해당 피드를 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '피드가 성공적으로 업데이트되었습니다.', updatedFeed });
    } catch (error) {
        console.error('피드 업데이트 중 오류 발생:', error);
        res.status(500).json({ message: '피드 업데이트 중 오류가 발생했습니다.' });
    }
});
// 피드 데이터 가져오기
app.get('/feeds', async (req, res) => {
    try {
        const feeds = await Feed.find().sort({ createdAt: -1 }); // 최신순으로 피드 데이터 가져오기
        res.status(200).json(feeds);
    } catch (error) {
        console.error('피드 데이터를 가져오는 중 오류 발생:', error);
        res.status(500).json({ message: '피드 데이터를 가져오는 중 오류가 발생했습니다.' });
    }
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
