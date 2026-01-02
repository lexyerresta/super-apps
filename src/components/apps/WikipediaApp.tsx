'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ExternalLink, Loader2, Globe, TrendingUp, Landmark, FlaskConical, Palette, BookOpen, ChevronDown, MapPin } from 'lucide-react';

interface WikiArticle {
    pageid: number;
    title: string;
    snippet?: string;
    extract?: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
    description?: string;
}

interface Region {
    code: string;
    name: string;
    flag: string;
    wiki: string;
}

const REGIONS: Region[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', wiki: 'en.wikipedia.org' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩', wiki: 'id.wikipedia.org' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', wiki: 'ja.wikipedia.org' },
    { code: 'zh', name: '中文', flag: '🇨🇳', wiki: 'zh.wikipedia.org' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', wiki: 'ko.wikipedia.org' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', wiki: 'de.wikipedia.org' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', wiki: 'fr.wikipedia.org' },
    { code: 'es', name: 'Español', flag: '🇪🇸', wiki: 'es.wikipedia.org' },
    { code: 'pt', name: 'Português', flag: '🇧🇷', wiki: 'pt.wikipedia.org' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', wiki: 'ru.wikipedia.org' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', wiki: 'ar.wikipedia.org' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', wiki: 'hi.wikipedia.org' },
];

type Category = 'featured' | 'trending' | 'history' | 'science' | 'arts' | 'geography';

const CATEGORIES: Record<Category, { label: string; icon: React.ReactNode }> = {
    featured: { label: 'Featured', icon: <TrendingUp size={14} /> },
    trending: { label: 'Popular', icon: <Globe size={14} /> },
    history: { label: 'History', icon: <Landmark size={14} /> },
    science: { label: 'Science', icon: <FlaskConical size={14} /> },
    arts: { label: 'Arts', icon: <Palette size={14} /> },
    geography: { label: 'Geography', icon: <MapPin size={14} /> },
};

// Curated articles per region
const CURATED_ARTICLES: Record<string, Record<Category, string[]>> = {
    en: {
        featured: ['Albert Einstein', 'William Shakespeare', 'Leonardo da Vinci', 'Marie Curie', 'Isaac Newton', 'Cleopatra', 'Napoleon', 'Mahatma Gandhi', 'Martin Luther King Jr.', 'Nelson Mandela'],
        trending: ['Artificial intelligence', 'Climate change', 'SpaceX', 'Electric vehicle', 'Cryptocurrency', 'ChatGPT', 'Quantum computing', 'Taylor Swift', 'World Cup', 'Nobel Prize'],
        history: ['World War II', 'World War I', 'Ancient Rome', 'Ancient Egypt', 'Renaissance', 'French Revolution', 'American Revolution', 'Industrial Revolution', 'Cold War', 'Roman Empire'],
        science: ['Theory of relativity', 'Quantum mechanics', 'DNA', 'Evolution', 'Black hole', 'Big Bang', 'Photosynthesis', 'Solar System', 'Milky Way', 'Atom'],
        arts: ['Mona Lisa', 'The Starry Night', 'Sistine Chapel ceiling', 'Guernica', 'The Scream', 'Renaissance art', 'Impressionism', 'Classical music', 'Jazz', 'Ballet'],
        geography: ['Mount Everest', 'Grand Canyon', 'Great Barrier Reef', 'Amazon rainforest', 'Sahara', 'Antarctica', 'Pacific Ocean', 'Nile', 'Himalayas', 'Alps'],
    },
    id: {
        featured: ['Soekarno', 'Indonesia', 'Jakarta', 'Borobudur', 'Bali', 'Joko Widodo', 'Pancasila', 'Bahasa Indonesia', 'Garuda Indonesia', 'Bank Indonesia'],
        trending: ['Timnas Indonesia', 'Liga 1 Indonesia', 'Rupiah', 'Jakarta', 'Pilpres Indonesia', 'BUMN', 'MRT Jakarta', 'IKN Nusantara', 'Pertamina', 'Tokopedia'],
        history: ['Majapahit', 'Sriwijaya', 'Proklamasi Kemerdekaan Indonesia', 'Perang Diponegoro', 'Hindia Belanda', 'Reformasi Indonesia', 'G30S', 'Orde Baru', 'Kerajaan Mataram', 'VOC'],
        science: ['LIPI', 'BRIN', 'Universitas Indonesia', 'ITB', 'Observatorium Bosscha', 'Biodiversitas Indonesia', 'Ring of Fire', 'Gunung Merapi', 'Tsunami Aceh 2004', 'BMKG'],
        arts: ['Wayang', 'Batik', 'Gamelan', 'Tari Kecak', 'Angklung', 'Reog Ponorogo', 'Tari Saman', 'Tari Pendet', 'Keris', 'Musik Dangdut'],
        geography: ['Pulau Jawa', 'Pulau Sumatra', 'Kalimantan', 'Papua', 'Sulawesi', 'Komodo', 'Danau Toba', 'Raja Ampat', 'Gunung Bromo', 'Lombok'],
    },
    ja: {
        featured: ['日本', '東京', '天皇', '富士山', '源氏物語', '徳川家康', '織田信長', '宮崎駿', '手塚治虫', '黒澤明'],
        trending: ['東京オリンピック', 'Nintendo', 'ソニー', 'トヨタ自動車', 'ポケモン', '大谷翔平', '新幹線', '鳥山明', '進撃の巨人', 'ChatGPT'],
        history: ['明治維新', '江戸時代', '戦国時代', '第二次世界大戦', '平安時代', '鎌倉幕府', '原爆', 'サムライ', '紫式部', '武士道'],
        science: ['ノーベル賞', 'JAXA', 'はやぶさ', '量子コンピュータ', 'iPS細胞', '青色LED', '南部陽一郎', '湯川秀樹', '本庶佑', '理化学研究所'],
        arts: ['浮世絵', '歌舞伎', '能', '茶道', '華道', '書道', '俳句', '着物', '日本庭園', 'アニメ'],
        geography: ['北海道', '沖縄', '京都', '大阪', '広島', '富士山', '瀬戸内海', '日本アルプス', '琵琶湖', '屋久島'],
    },
    zh: {
        featured: ['中国', '北京', '长城', '习近平', '孔子', '毛泽东', '秦始皇', '李白', '杜甫', '曹操'],
        trending: ['人工智能', '微信', '阿里巴巴', '腾讯', '华为', '抖音', '小红书', '电动汽车', '中国航天', '世界杯'],
        history: ['三国演义', '唐朝', '清朝', '秦朝', '汉朝', '明朝', '中华人民共和国', '鸦片战争', '丝绸之路', '长征'],
        science: ['量子计算', '中国空间站', '北斗卫星', '高速铁路', '嫦娥工程', '天宫空间站', '屠呦呦', '钱学森', '袁隆平', '中国科学院'],
        arts: ['京剧', '书法', '中国画', '瓷器', '太极拳', '功夫', '兵马俑', '故宫', '敦煌莫高窟', '中国音乐'],
        geography: ['长江', '黄河', '珠穆朗玛峰', '香港', '上海', '西藏', '新疆', '云南', '桂林', '九寨沟'],
    },
    ko: {
        featured: ['대한민국', '서울', '한글', '세종대왕', 'BTS', '삼성', '현대자동차', 'K-pop', '박정희', '김구'],
        trending: ['손흥민', '블랙핑크', 'BTS', '넷플릭스', '카카오', '네이버', '오징어 게임', '파묘', '삼성전자', 'KIA 타이거즈'],
        history: ['조선', '고려', '삼국시대', '임진왜란', '일제강점기', '6·25 전쟁', '의병', '독립운동', '민주화운동', '세종대왕'],
        science: ['KAIST', '서울대학교', '삼성전자', 'SK하이닉스', 'LG전자', '한국항공우주연구원', '원자력연구원', '한국과학기술원', '누리호', '나로호'],
        arts: ['한복', '태권도', '사물놀이', '판소리', '탈춤', '한옥', '비빔밥', '김치', '한류', '드라마'],
        geography: ['제주도', '한라산', '설악산', '부산', '경주', '독도', '한강', '백두산', '지리산', '울릉도'],
    },
    de: {
        featured: ['Deutschland', 'Berlin', 'Angela Merkel', 'Albert Einstein', 'Johann Wolfgang von Goethe', 'Ludwig van Beethoven', 'Martin Luther', 'Johann Sebastian Bach', 'Immanuel Kant', 'Karl Marx'],
        trending: ['Bundesliga', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Oktoberfest', 'Eurovision', 'Künstliche Intelligenz', 'Energiewende', 'Scholz', 'Champions League'],
        history: ['Zweiter Weltkrieg', 'Heiliges Römisches Reich', 'Mauerfall', 'Weimarer Republik', 'Erster Weltkrieg', 'Preußen', 'Otto von Bismarck', 'Reformation', 'Holocaust', 'DDR'],
        science: ['Max Planck', 'Werner Heisenberg', 'Robert Koch', 'Carl Friedrich Gauß', 'Alexander von Humboldt', 'Gottfried Wilhelm Leibniz', 'DLR', 'Max-Planck-Gesellschaft', 'Fraunhofer-Gesellschaft', 'CERN'],
        arts: ['Bauhaus', 'Romantik', 'Expressionismus', 'Richard Wagner', 'Albrecht Dürer', 'Berliner Philharmoniker', 'Documenta', 'Kölner Dom', 'Neuschwanstein', 'Grimms Märchen'],
        geography: ['Alpen', 'Schwarzwald', 'Rhein', 'Bayern', 'Nordsee', 'Ostsee', 'Zugspitze', 'Bodensee', 'Hamburg', 'München'],
    },
    fr: {
        featured: ['France', 'Paris', 'Emmanuel Macron', 'Napoléon Ier', 'Louis XIV', 'Charles de Gaulle', 'Victor Hugo', 'Voltaire', 'Marie Curie', 'Claude Monet'],
        trending: ['Ligue 1', 'PSG', 'Intelligence artificielle', 'Jeux olympiques', 'Tour de France', 'LVMH', 'Coupe du monde', 'ChatGPT', 'Cannes', 'Netflix'],
        history: ['Révolution française', 'Première Guerre mondiale', 'Seconde Guerre mondiale', 'Moyen Âge', 'Renaissance', 'Empire français', 'Résistance', 'Mai 68', 'Guerre de Cent Ans', 'Croisades'],
        science: ['CNRS', 'Institut Pasteur', 'CEA', 'Ariane', 'Louis Pasteur', 'Antoine Lavoisier', 'Pierre Curie', 'Marie Curie', 'Blaise Pascal', 'René Descartes'],
        arts: ['Impressionnisme', 'Louvre', 'Tour Eiffel', 'Château de Versailles', 'Édith Piaf', 'Coco Chanel', 'Auguste Rodin', 'Nouvelle Vague', 'Cannes', 'Opéra de Paris'],
        geography: ['Alpes', 'Côte dAzur', 'Mont Blanc', 'Loire', 'Provence', 'Bretagne', 'Corse', 'Normandie', 'Pyrénées', 'Seine'],
    },
    es: {
        featured: ['España', 'Madrid', 'Miguel de Cervantes', 'Pablo Picasso', 'Salvador Dalí', 'Francisco de Goya', 'Real Madrid', 'FC Barcelona', 'Felipe VI', 'Diego Velázquez'],
        trending: ['La Liga', 'Real Madrid', 'FC Barcelona', 'Inteligencia artificial', 'Netflix', 'Bad Bunny', 'Messi', 'Copa del Mundo', 'ChatGPT', 'Euro 2024'],
        history: ['Guerra Civil Española', 'Reconquista', 'Imperio español', 'Descubrimiento de América', 'Inquisición española', 'Siglo de Oro', 'Al-Ándalus', 'Felipe II', 'Dictadura de Franco', 'Transición española'],
        science: ['Santiago Ramón y Cajal', 'Severo Ochoa', 'CSIC', 'ESA', 'Instituto Cervantes', 'CERN', 'Observatorio astronómico', 'Universidad de Salamanca', 'Física nuclear', 'Biotecnología'],
        arts: ['Flamenco', 'Alhambra', 'Sagrada Familia', 'Museo del Prado', 'Guernica', 'Torres de Serrano', 'Gaudí', 'Zarzuela', 'Corrida de toros', 'Tapas'],
        geography: ['Pirineos', 'Islas Canarias', 'Islas Baleares', 'Andalucía', 'Cataluña', 'Galicia', 'País Vasco', 'Sierra Nevada', 'Costa Brava', 'Camino de Santiago'],
    },
    pt: {
        featured: ['Brasil', 'São Paulo', 'Rio de Janeiro', 'Pelé', 'Portugal', 'Lula', 'Getúlio Vargas', 'Machado de Assis', 'Fernando Pessoa', 'Ayrton Senna'],
        trending: ['Brasileirão', 'Flamengo', 'Corinthians', 'Neymar', 'Vinicius Junior', 'BBB', 'Carnaval', 'Copa do Mundo', 'Inteligência artificial', 'Netflix'],
        history: ['Descobrimento do Brasil', 'Império do Brasil', 'República Velha', 'Era Vargas', 'Ditadura militar', 'Independência do Brasil', 'Proclamação da República', 'Descobrimentos portugueses', 'Escravidão no Brasil', 'Bandeirantes'],
        science: ['Oswaldo Cruz', 'Carlos Chagas', 'Fiocruz', 'INPE', 'Embrapa', 'USP', 'Santos Dumont', 'César Lattes', 'Petrobras', 'Butantan'],
        arts: ['Bossa nova', 'Samba', 'Carnaval', 'Teatro Amazonas', 'Oscar Niemeyer', 'Brasília', 'Cristo Redentor', 'MPB', 'Tropicália', 'Portinari'],
        geography: ['Amazônia', 'Pantanal', 'Fernando de Noronha', 'Cataratas do Iguaçu', 'Chapada Diamantina', 'Lençóis Maranhenses', 'Floresta Atlântica', 'Pão de Açúcar', 'Copacabana', 'Salvador'],
    },
    ru: {
        featured: ['Россия', 'Москва', 'Владимир Путин', 'Пётр I', 'Лев Толстой', 'Фёдор Достоевский', 'Александр Пушкин', 'Иосиф Сталин', 'Владимир Ленин', 'Екатерина II'],
        trending: ['Премьер-лига России', 'Спартак', 'Искусственный интеллект', 'ChatGPT', 'Роскосмос', 'Газпром', 'Сбербанк', 'Яндекс', 'ВКонтакте', 'Telegram'],
        history: ['Вторая мировая война', 'Октябрьская революция', 'Российская империя', 'СССР', 'Холодная война', 'Великая Отечественная война', 'ГУЛАГ', 'Крещение Руси', 'Отечественная война 1812 года', 'Распад СССР'],
        science: ['Роскосмос', 'МКС', 'Юрий Гагарин', 'Сергей Королёв', 'Дмитрий Менделеев', 'Иван Павлов', 'Курчатовский институт', 'МГУ', 'Академия наук', 'Сколково'],
        arts: ['Большой театр', 'Эрмитаж', 'Балет', 'Пётр Чайковский', 'Матрёшка', 'Фаберже', 'Третьяковская галерея', 'Русский авангард', 'Икона', 'Хохлома'],
        geography: ['Сибирь', 'Байкал', 'Камчатка', 'Урал', 'Волга', 'Санкт-Петербург', 'Кавказ', 'Сочи', 'Алтай', 'Арктика'],
    },
    ar: {
        featured: ['السعودية', 'مصر', 'الإمارات', 'محمد بن سلمان', 'صلاح الدين الأيوبي', 'ابن خلدون', 'الجزيرة', 'مكة المكرمة', 'القاهرة', 'دبي'],
        trending: ['الدوري السعودي', 'كريستيانو رونالدو', 'الهلال', 'النصر', 'كأس العالم', 'الذكاء الاصطناعي', 'رؤية 2030', 'نيوم', 'قطر', 'موسم الرياض'],
        history: ['الخلافة الإسلامية', 'الدولة العباسية', 'الدولة الأموية', 'الفتوحات الإسلامية', 'العصر الذهبي للإسلام', 'الأندلس', 'المماليك', 'الدولة العثمانية', 'الربيع العربي', 'حرب الخليج'],
        science: ['ابن سينا', 'الخوارزمي', 'ابن الهيثم', 'جابر بن حيان', 'الرازي', 'جامعة الملك سعود', 'مدينة الملك عبدالله', 'كاوست', 'وكالة الفضاء السعودية', 'أرامكو'],
        arts: ['الخط العربي', 'العمارة الإسلامية', 'أم كلثوم', 'فيروز', 'الشعر العربي', 'المقامات الموسيقية', 'الزخرفة الإسلامية', 'العود', 'الرقص الشرقي', 'السينما المصرية'],
        geography: ['شبه الجزيرة العربية', 'نهر النيل', 'الأهرامات', 'البحر الأحمر', 'الصحراء العربية', 'جبال الحجاز', 'واحة الأحساء', 'البتراء', 'بحر العرب', 'الخليج العربي'],
    },
    hi: {
        featured: ['भारत', 'नई दिल्ली', 'नरेंद्र मोदी', 'महात्मा गांधी', 'जवाहरलाल नेहरू', 'भारतीय संविधान', 'ताजमहल', 'बॉलीवुड', 'क्रिकेट', 'हिंदी'],
        trending: ['IPL', 'विराट कोहली', 'रोहित शर्मा', 'बॉलीवुड', 'ChatGPT', 'जियो', 'Reliance', 'UPI', 'इसरो', 'चंद्रयान'],
        history: ['मुगल साम्राज्य', 'ब्रिटिश राज', 'भारतीय स्वतंत्रता आंदोलन', 'मौर्य साम्राज्य', 'गुप्त साम्राज्य', 'हड़प्पा सभ्यता', 'सिख साम्राज्य', 'मराठा साम्राज्य', '1857 का विद्रोह', 'विभाजन'],
        science: ['इसरो', 'चंद्रयान-3', 'मंगलयान', 'ए.पी.जे. अब्दुल कलाम', 'सी.वी. रमन', 'होमी भाभा', 'DRDO', 'IIT', 'AIIMS', 'BARC'],
        arts: ['बॉलीवुड', 'भरतनाट्यम', 'कथक', 'हिंदुस्तानी संगीत', 'कर्नाटक संगीत', 'रंगोली', 'मेहंदी', 'सितार', 'तबला', 'योग'],
        geography: ['हिमालय', 'गंगा', 'केरल', 'राजस्थान', 'कश्मीर', 'गोवा', 'वाराणसी', 'जयपुर', 'आगरा', 'मुंबई'],
    },
};

const ITEMS_PER_PAGE = 10;

export default function WikipediaApp() {
    const [articles, setArticles] = useState<WikiArticle[]>([]);
    const [displayedArticles, setDisplayedArticles] = useState<WikiArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [region, setRegion] = useState<Region>(REGIONS[0]);
    const [category, setCategory] = useState<Category>('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getWikiApi = (lang: string) => `https://${lang}.wikipedia.org/w/api.php`;

    const fetchArticleDetails = async (titles: string[], lang: string): Promise<WikiArticle[]> => {
        const url = `${getWikiApi(lang)}?action=query&titles=${encodeURIComponent(titles.join('|'))}&prop=extracts|pageimages|description&exintro=1&explaintext=1&exsentences=2&piprop=thumbnail&pithumbsize=300&format=json&origin=*`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.query?.pages) {
            return Object.values(data.query.pages)
                .filter((page: any) => page.pageid && !page.missing)
                .map((page: any) => ({
                    pageid: page.pageid,
                    title: page.title,
                    extract: page.extract,
                    thumbnail: page.thumbnail,
                    description: page.description
                }));
        }
        return [];
    };

    const fetchCategoryArticles = useCallback(async (cat: Category, reg: Region) => {
        setLoading(true);
        setError('');
        setPage(1);
        setArticles([]);
        setDisplayedArticles([]);

        try {
            // Get curated articles for region, fallback to English
            const regionArticles = CURATED_ARTICLES[reg.code] || CURATED_ARTICLES['en'];
            const titles = regionArticles[cat] || [];

            const results = await fetchArticleDetails(titles, reg.code);

            // Sort to match original order
            const sortedResults = titles
                .map(title => results.find(r => r.title.toLowerCase() === title.toLowerCase()))
                .filter((r): r is WikiArticle => r !== undefined);

            setArticles(sortedResults);
            setDisplayedArticles(sortedResults.slice(0, ITEMS_PER_PAGE));
            setHasMore(sortedResults.length > ITEMS_PER_PAGE);

        } catch (err) {
            console.error('Failed to fetch articles:', err);
            setError('Failed to load articles. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchWikipedia = useCallback(async (query: string) => {
        if (!query.trim()) {
            fetchCategoryArticles(category, region);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const searchUrl = `${getWikiApi(region.code)}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=20`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();

            const titles = (searchData.query?.search || []).map((r: any) => r.title);

            if (titles.length > 0) {
                const results = await fetchArticleDetails(titles, region.code);
                setArticles(results);
                setDisplayedArticles(results.slice(0, ITEMS_PER_PAGE));
                setPage(1);
                setHasMore(results.length > ITEMS_PER_PAGE);
            } else {
                setArticles([]);
                setDisplayedArticles([]);
                setHasMore(false);
            }

        } catch (err) {
            console.error('Search failed:', err);
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [category, region, fetchCategoryArticles]);

    // Load more
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        const endIndex = nextPage * ITEMS_PER_PAGE;

        setTimeout(() => {
            setDisplayedArticles(articles.slice(0, endIndex));
            setPage(nextPage);
            setHasMore(endIndex < articles.length);
            setLoadingMore(false);
        }, 200);
    }, [page, loadingMore, hasMore, articles]);

    // Intersection Observer
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
        return () => observerRef.current?.disconnect();
    }, [loadMore, hasMore, loadingMore, loading]);

    // Fetch on category or region change
    useEffect(() => {
        setSearchQuery('');
        fetchCategoryArticles(category, region);
    }, [category, region, fetchCategoryArticles]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowRegionDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchWikipedia(searchQuery);
    };

    const handleImageError = (pageid: number) => {
        setImageErrors(prev => new Set(prev).add(pageid));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header with Region Selector */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={22} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Wikipedia</span>
                </div>

                {/* Region Dropdown */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.75rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <span>{region.flag}</span>
                        <span>{region.name}</span>
                        <ChevronDown size={14} style={{
                            transition: 'transform 0.2s',
                            transform: showRegionDropdown ? 'rotate(180deg)' : 'rotate(0)'
                        }} />
                    </button>

                    {showRegionDropdown && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '4px',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            zIndex: 100,
                            maxHeight: '250px',
                            overflowY: 'auto',
                            minWidth: '150px'
                        }}>
                            {REGIONS.map((r) => (
                                <button
                                    key={r.code}
                                    onClick={() => {
                                        setRegion(r);
                                        setShowRegionDropdown(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        width: '100%',
                                        padding: '0.6rem 1rem',
                                        background: region.code === r.code ? 'var(--bg-tertiary)' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-primary)',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span>{r.flag}</span>
                                    <span>{r.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder={`Search ${region.name} Wikipedia...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            paddingLeft: '38px',
                            fontSize: '0.9rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0 1.25rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                    }}
                >
                    Search
                </button>
            </form>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.4rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                paddingRight: '1rem',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: 'none'
            }}>
                {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat], index, arr) => (
                    <button
                        key={key}
                        onClick={() => setCategory(key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.5rem 0.9rem',
                            background: category === key ? 'var(--primary)' : 'var(--bg-secondary)',
                            color: category === key ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: category === key ? '600' : '500',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                            marginRight: index === arr.length - 1 ? '1rem' : 0
                        }}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(255,100,100,0.1)',
                    borderRadius: '10px',
                    color: '#ff6b6b',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                    <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>Loading articles...</div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : displayedArticles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No articles found
                </div>
            ) : (
                <>
                    {/* Articles List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {displayedArticles.map((article) => (
                            <div
                                key={article.pageid}
                                onClick={() => window.open(`https://${region.wiki}/?curid=${article.pageid}`, '_blank')}
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-secondary)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                {/* Thumbnail */}
                                <div style={{
                                    flexShrink: 0,
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {article.thumbnail && !imageErrors.has(article.pageid) ? (
                                        <img
                                            src={article.thumbnail.source}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loading="lazy"
                                            onError={() => handleImageError(article.pageid)}
                                        />
                                    ) : (
                                        <Globe size={24} style={{ color: 'white', opacity: 0.8 }} />
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        marginBottom: '0.25rem',
                                        color: 'var(--primary)'
                                    }}>
                                        {article.title}
                                    </div>

                                    {article.description && (
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--text-tertiary)',
                                            marginBottom: '0.3rem',
                                            fontStyle: 'italic'
                                        }}>
                                            {article.description}
                                        </div>
                                    )}

                                    {article.extract && (
                                        <div style={{
                                            fontSize: '0.78rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: '1.35',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {article.extract}
                                        </div>
                                    )}

                                    <div style={{
                                        marginTop: '0.4rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        color: 'var(--primary)',
                                        fontSize: '0.7rem',
                                        fontWeight: '500'
                                    }}>
                                        Read on {region.name} Wikipedia <ExternalLink size={11} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Trigger */}
                    <div ref={loadMoreRef} style={{ padding: '1rem', textAlign: 'center' }}>
                        {loadingMore && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                                <span style={{ fontSize: '0.85rem' }}>Loading more...</span>
                            </div>
                        )}
                        {!hasMore && displayedArticles.length > 0 && (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                ✓ End of articles
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
