import { LessonContent } from "../types";

// Pre-generated content to ensure instant loading for the first lessons
// This acts as a Tier-1 Cache / Offline Data
export const STATIC_LESSONS: Record<string, LessonContent> = {
  // Key format: LANGUAGE-TITLE
  
  // TW Mode: Lesson 1
  "TW-Xin Chào (打招呼)": {
    "title": "Xin Chào (打招呼)",
    "introduction": "歡迎來到第一課！在這裡我們將學習越南語中最基本的問候方式。越南語非常注重禮貌與輩分，因此「你」和「我」的說法會根據對象而改變。這堂課我們將一次掌握常用的稱呼與基本句型。",
    "dialogue": [
      {
        "speaker": "Hùng (雄)",
        "vietnamese": "Chào em, em tên là gì?",
        "mandarin": "你好(對晚輩)，你叫什麼名字？"
      },
      {
        "speaker": "Lan (蘭)",
        "vietnamese": "Em chào anh. Em tên là Lan ạ.",
        "mandarin": "哥哥你好。我叫小蘭。(加 'ạ' 表示敬語)"
      },
      {
        "speaker": "Hùng (雄)",
        "vietnamese": "Anh là người Việt Nam. Còn em?",
        "mandarin": "我是越南人。你呢？"
      },
      {
        "speaker": "Lan (蘭)",
        "vietnamese": "Em là người Đài Loan. Rất vui được làm quen với anh.",
        "mandarin": "我是台灣人。很高興認識你。"
      }
    ],
    "vocabulary": [
      {
        "word": "Xin chào",
        "meaning": "你好 (通用/正式)",
        "pronunciation": "sin tɕaːw",
        "han_viet": "漢越：欣朝",
        "type": "慣用語"
      },
      {
        "word": "Tạm biệt",
        "meaning": "再見",
        "pronunciation": "tam ɓiət",
        "han_viet": "漢越：暫別",
        "type": "慣用語"
      },
      {
        "word": "Cảm ơn",
        "meaning": "謝謝",
        "pronunciation": "kaːm əːn",
        "han_viet": "漢越：感恩",
        "type": "慣用語"
      },
      {
        "word": "Xin lỗi",
        "meaning": "對不起/不好意思",
        "pronunciation": "sin loj",
        "han_viet": "漢越：—",
        "type": "慣用語"
      },
      {
        "word": "Tôi",
        "meaning": "我 (通用/正式)",
        "pronunciation": "toj",
        "han_viet": "漢越：—",
        "type": "代詞"
      },
      {
        "word": "Bạn",
        "meaning": "你 (平輩/朋友)",
        "pronunciation": "ɓaːn",
        "han_viet": "漢越：伴",
        "type": "代詞"
      },
      {
        "word": "Anh",
        "meaning": "哥哥 (稱呼稍長的男性/自稱)",
        "pronunciation": "aɲ",
        "han_viet": "漢越：英",
        "type": "代詞"
      },
      {
        "word": "Chị",
        "meaning": "姊姊 (稱呼稍長的女性/自稱)",
        "pronunciation": "tɕi",
        "han_viet": "漢越：姊",
        "type": "代詞"
      },
      {
        "word": "Em",
        "meaning": "弟弟/妹妹 (稱呼晚輩/自稱)",
        "pronunciation": "ɛm",
        "han_viet": "漢越：—",
        "type": "代詞"
      },
      {
        "word": "Ông",
        "meaning": "爺爺/先生 (尊稱長輩)",
        "pronunciation": "oŋ",
        "han_viet": "漢越：翁",
        "type": "代詞"
      },
      {
        "word": "Bà",
        "meaning": "奶奶/女士 (尊稱長輩)",
        "pronunciation": "ɓaː",
        "han_viet": "漢越：婆",
        "type": "代詞"
      },
      {
        "word": "Thầy",
        "meaning": "男老師",
        "pronunciation": "tʰəj",
        "han_viet": "漢越：師",
        "type": "名詞"
      },
      {
        "word": "Cô",
        "meaning": "女老師 / 姑姑 (爸爸的妹妹)",
        "pronunciation": "ko",
        "han_viet": "漢越：姑",
        "type": "名詞"
      },
      {
        "word": "Dì",
        "meaning": "阿姨 (媽媽的妹妹)",
        "pronunciation": "zi (北) / ji (南)",
        "han_viet": "漢越：姨",
        "type": "名詞"
      },
      {
        "word": "Tên",
        "meaning": "名字",
        "pronunciation": "ten",
        "han_viet": "漢越：名",
        "type": "名詞"
      },
      {
        "word": "Là",
        "meaning": "是",
        "pronunciation": "laː",
        "han_viet": "漢越：羅",
        "type": "動詞"
      },
      {
        "word": "Gì",
        "meaning": "什麼",
        "pronunciation": "zi",
        "han_viet": "漢越：夷",
        "type": "代詞"
      },
      {
        "word": "Người",
        "meaning": "人",
        "pronunciation": "ŋɨəj",
        "han_viet": "漢越：—",
        "type": "名詞"
      },
      {
        "word": "Đài Loan",
        "meaning": "台灣",
        "pronunciation": "ɗaːj lwaːn",
        "han_viet": "漢越：臺灣",
        "type": "名詞"
      },
      {
        "word": "Việt Nam",
        "meaning": "越南",
        "pronunciation": "viət naːm",
        "han_viet": "漢越：越南",
        "type": "名詞"
      },
      {
        "word": "Rất",
        "meaning": "很、非常",
        "pronunciation": "zət",
        "han_viet": "漢越：—",
        "type": "副詞"
      },
      {
        "word": "Vui",
        "meaning": "高興、快樂",
        "pronunciation": "vuj",
        "han_viet": "漢越：—",
        "type": "形容詞"
      },
      {
        "word": "Khỏe",
        "meaning": "健康 (用於問候)",
        "pronunciation": "xwɛ",
        "han_viet": "漢越：—",
        "type": "形容詞"
      }
    ],
    "grammar": [
      {
        "title": "人稱代詞系統 (Anh / Chị / Em)",
        "explanation": "越南語沒有通用的「你」或「我」，必須根據年齡與關係選擇代詞。對比自己大的男生叫 'Anh'，女生叫 'Chị'；對比自己小的叫 'Em'。自稱時也隨之改變 (例如對哥哥說話時，自稱 'Em')。",
        "exampleViet": "Em chào anh.",
        "exampleMandarin": "你好 (弟弟/妹妹 對 哥哥 打招呼)。"
      },
      {
        "title": "句型：A là B (A 是 B)",
        "explanation": "這是最基本的句子結構，類似英文的 'A is B' 或中文的 'A 是 B'。用來介紹名字、國籍或身分。",
        "exampleViet": "Tôi là người Đài Loan.",
        "exampleMandarin": "我是台灣人。"
      },
      {
        "title": "句型：... không? (…嗎?)",
        "explanation": "在句尾加上 'không' 會變成是非問句，相當於中文的「嗎」。",
        "exampleViet": "Bạn khỏe không?",
        "exampleMandarin": "你好嗎？(身體健康嗎？)"
      }
    ],
    "practice_quiz": [
      {
        "question": "重組句子：我是小蘭。",
        "correct_sentence": "Tôi là Lan",
        "scrambled_words": ["Tôi", "là", "không", "Lan"],
        "explanation": "基本句型：主詞 (Tôi) + 動詞 (là) + 受詞/補語 (Lan)。"
      },
      {
        "question": "重組句子：很高興認識你。",
        "correct_sentence": "Rất vui được làm quen",
        "scrambled_words": ["Rất", "buồn", "vui", "được", "làm", "quen"],
        "explanation": "固定慣用語：Rất vui được làm quen。"
      },
      {
        "question": "重組句子：你是台灣人。",
        "correct_sentence": "Bạn là người Đài Loan",
        "scrambled_words": ["Bạn", "là", "Việt Nam", "người", "Đài Loan"],
        "explanation": "主詞 (Bạn) + 是 (là) + 人 (người) + 台灣 (Đài Loan)。"
      },
      {
        "question": "重組句子：你好嗎？",
        "correct_sentence": "Bạn khỏe không",
        "scrambled_words": ["Bạn", "chào", "khỏe", "không"],
        "explanation": "主詞 (Bạn) + 形容詞 (khỏe) + 疑問詞 (không)。"
      },
      {
        "question": "重組句子：再見。",
        "correct_sentence": "Tạm biệt",
        "scrambled_words": ["Xin", "Tạm", "biệt", "lỗi"],
        "explanation": "Tạm biệt 是再見的意思。"
      },
      {
        "question": "重組句子：我是越南人。",
        "correct_sentence": "Tôi là người Việt Nam",
        "scrambled_words": ["Tôi", "là", "người", "Đài Loan", "Việt Nam"],
        "explanation": "主詞 (Tôi) + 是 (là) + 人 (người) + 越南 (Việt Nam)。"
      }
    ]
  },

  // VN Mode: Lesson 1
  "VN-Xin Chào (你好)": {
    "title": "Xin Chào (你好)",
    "introduction": "Chào mừng bạn đến với bài học đầu tiên! Tiếng Trung (Phồn thể) là ngôn ngữ chính tại Đài Loan. Trong bài này, chúng ta sẽ học 20 từ vựng cơ bản nhất, cách chào hỏi, giới thiệu tên và quốc tịch.",
    "dialogue": [
      {
        "speaker": "Hùng",
        "vietnamese": "你好！你叫什麼名字？",
        "mandarin": "Xin chào! Bạn tên là gì?"
      },
      {
        "speaker": "Lan",
        "vietnamese": "你好！我叫小蘭。",
        "mandarin": "Xin chào! Tôi tên là Tiểu Lan."
      },
      {
        "speaker": "Hùng",
        "vietnamese": "你是哪國人？",
        "mandarin": "Bạn là người nước nào?"
      },
      {
        "speaker": "Lan",
        "vietnamese": "我是越南人。很高興認識你。",
        "mandarin": "Tôi là người Việt Nam. Rất vui được làm quen với bạn."
      }
    ],
    "vocabulary": [
      {
        "word": "你好",
        "meaning": "Xin chào",
        "pronunciation": "nǐ hǎo",
        "han_viet": "Nhĩ Hảo",
        "type": "Câu chào"
      },
      {
        "word": "再見",
        "meaning": "Tạm biệt",
        "pronunciation": "zài jiàn",
        "han_viet": "Tái Kiến",
        "type": "Câu chào"
      },
      {
        "word": "謝謝",
        "meaning": "Cảm ơn",
        "pronunciation": "xiè xie",
        "han_viet": "Tạ Tạ",
        "type": "Câu chào"
      },
      {
        "word": "對不起",
        "meaning": "Xin lỗi",
        "pronunciation": "duì bu qǐ",
        "han_viet": "Đối Bất Khởi",
        "type": "Câu chào"
      },
      {
        "word": "我",
        "meaning": "Tôi",
        "pronunciation": "wǒ",
        "han_viet": "Ngã",
        "type": "Đại từ"
      },
      {
        "word": "你",
        "meaning": "Bạn (Ngôi thứ 2)",
        "pronunciation": "nǐ",
        "han_viet": "Nhĩ",
        "type": "Đại từ"
      },
      {
        "word": "他",
        "meaning": "Anh ấy",
        "pronunciation": "tā",
        "han_viet": "Tha",
        "type": "Đại từ"
      },
      {
        "word": "她",
        "meaning": "Cô ấy",
        "pronunciation": "tā",
        "han_viet": "Tha",
        "type": "Đại từ"
      },
      {
        "word": "叫",
        "meaning": "Tên là / Gọi là",
        "pronunciation": "jiào",
        "han_viet": "Khiếu",
        "type": "Động từ"
      },
      {
        "word": "什麼",
        "meaning": "Cái gì",
        "pronunciation": "shén me",
        "han_viet": "Thập Ma",
        "type": "Đại từ"
      },
      {
        "word": "名字",
        "meaning": "Tên",
        "pronunciation": "míng zi",
        "han_viet": "Danh Tự",
        "type": "Danh từ"
      },
      {
        "word": "是",
        "meaning": "Là",
        "pronunciation": "shì",
        "han_viet": "Thị",
        "type": "Động từ"
      },
      {
        "word": "人",
        "meaning": "Người",
        "pronunciation": "rén",
        "han_viet": "Nhân",
        "type": "Danh từ"
      },
      {
        "word": "台灣",
        "meaning": "Đài Loan",
        "pronunciation": "Tái wān",
        "han_viet": "Đài Loan",
        "type": "Danh từ"
      },
      {
        "word": "越南",
        "meaning": "Việt Nam",
        "pronunciation": "Yuè nán",
        "han_viet": "Việt Nam",
        "type": "Danh từ"
      },
      {
        "word": "很高興",
        "meaning": "Rất vui",
        "pronunciation": "hěn gāo xìng",
        "han_viet": "Hấn Cao Hứng",
        "type": "Tính từ"
      },
      {
        "word": "認識",
        "meaning": "Quen biết",
        "pronunciation": "rèn shì",
        "han_viet": "Nhận Thức",
        "type": "Động từ"
      },
      {
        "word": "老師",
        "meaning": "Giáo viên",
        "pronunciation": "lǎo shī",
        "han_viet": "Lão Sư",
        "type": "Danh từ"
      },
      {
        "word": "學生",
        "meaning": "Học sinh",
        "pronunciation": "xué shēng",
        "han_viet": "Học Sinh",
        "type": "Danh từ"
      },
      {
        "word": "好",
        "meaning": "Tốt / Khỏe",
        "pronunciation": "hǎo",
        "han_viet": "Hảo",
        "type": "Tính từ"
      }
    ],
    "grammar": [
      {
        "title": "Chào hỏi: 你好 (Nǐ hǎo)",
        "explanation": "Đây là cách chào hỏi phổ biến nhất, dùng cho mọi đối tượng. 'Nǐ' (bạn) + 'Hǎo' (tốt).",
        "exampleViet": "你好!",
        "exampleMandarin": "Xin chào!"
      },
      {
        "title": "Hỏi tên: 你叫什麼名字?",
        "explanation": "Cấu trúc: Chủ ngữ + 叫 (gọi là) + 什麼 (gì) + 名字 (tên).",
        "exampleViet": "你叫什麼名字?",
        "exampleMandarin": "Bạn tên là gì?"
      },
      {
        "title": "Cấu trúc: A 是 B (A là B)",
        "explanation": "Dùng để giới thiệu thân phận hoặc quốc tịch. Chủ ngữ + 是 (là) + Danh từ.",
        "exampleViet": "我是越南人。",
        "exampleMandarin": "Tôi là người Việt Nam."
      }
    ],
    "practice_quiz": [
      {
        "question": "Sắp xếp câu: Tôi tên là Hùng.",
        "correct_sentence": "我 叫 阿 雄",
        "scrambled_words": ["我", "叫", "不", "阿", "雄"],
        "explanation": "Cấu trúc: Chủ ngữ (我) + Động từ (叫) + Tên (阿雄). '不' là không, không cần dùng ở đây."
      },
      {
        "question": "Sắp xếp câu: Xin chào.",
        "correct_sentence": "你 好",
        "scrambled_words": ["你", "好", "嗎"],
        "explanation": "Câu chào cơ bản là '你好'. '嗎' dùng để hỏi thăm sức khỏe (Bạn khỏe không?), không dùng trong câu chào đơn thuần."
      },
      {
        "question": "Sắp xếp câu: Bạn là người Đài Loan.",
        "correct_sentence": "你 是 台灣 人",
        "scrambled_words": ["你", "是", "台灣", "人", "嗎"],
        "explanation": "Chủ ngữ (你) + Là (是) + Đài Loan (台灣) + Người (人)."
      },
      {
        "question": "Sắp xếp câu: Rất vui được làm quen.",
        "correct_sentence": "很 高興 認識 你",
        "scrambled_words": ["很", "高興", "不", "認識", "你"],
        "explanation": "Rất (很) + Vui (高興) + Quen biết (認識) + Bạn (你)."
      },
      {
        "question": "Sắp xếp câu: Tạm biệt.",
        "correct_sentence": "再見",
        "scrambled_words": ["再見", "你好", "什麼"],
        "explanation": "再見 nghĩa là Tạm biệt."
      },
      {
        "question": "Sắp xếp câu: Tôi là học sinh.",
        "correct_sentence": "我 是 學生",
        "scrambled_words": ["我", "是", "老師", "學生"],
        "explanation": "Chủ ngữ (我) + Là (是) + Học sinh (學生)."
      }
    ]
  }
};