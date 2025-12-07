import { Lesson } from "./types";

export const SAMPLE_LESSONS: Lesson[] = [
  {
    id: 0,
    title: "Varnamala: Nguyên Âm (Svara)",
    category: "Căn Bản",
    description: "Hệ thống nguyên âm Sanskrit đầy đủ. Đây là hơi thở và linh hồn của ngôn ngữ.",
    content: [
      {
        sanskrit: "अ",
        iast: "a",
        english: "Short 'a', like in 'cup'.",
        vietnamese: "Âm 'a' ngắn. Phát âm nhẹ, như 'ờ' trong 'bờ' hoặc 'u' trong 'cup'.",
        explanation: "Âm thanh gốc rễ, hiện diện trong mọi phụ âm. Tượng trưng cho Shiva.",
        vocabulary: [
          { word: "अग्नि", iast: "agni", meaning: "Lửa/Thần Lửa", detail: "Một trong những vị thần Veda quan trọng nhất." },
          { word: "अश्व", iast: "aśva", meaning: "Con ngựa", detail: "Biểu tượng của sức mạnh và năng lượng sống." }
        ]
      },
      {
        sanskrit: "आ",
        iast: "ā",
        english: "Long 'a', like in 'father'.",
        vietnamese: "Âm 'a' dài. Mở rộng miệng, kéo dài gấp đôi âm 'a' ngắn. Như 'a' trong 'ba'.",
        explanation: "Biểu thị sự mở rộng, vươn xa, năng lượng Shakti.",
        vocabulary: [
          { word: "आनन्द", iast: "ānanda", meaning: "Hạnh phúc tột cùng", detail: "Niềm vui sướng tinh thần, phúc lạc." },
          { word: "आसन", iast: "āsana", meaning: "Tư thế ngồi", detail: "Thuật ngữ quen thuộc trong Yoga." }
        ]
      },
      {
        sanskrit: "इ",
        iast: "i",
        english: "Short 'i', like in 'bit'.",
        vietnamese: "Âm 'i' ngắn. Dứt khoát, như 'i' trong 'ít'.",
        explanation: "Sức mạnh ý chí (Iccha Shakti).",
        vocabulary: [
          { word: "इन्द्र", iast: "indra", meaning: "Thần Indra", detail: "Vua của các vị thần." },
          { word: "इति", iast: "iti", meaning: "Như vậy", detail: "Từ dùng để kết thúc một câu trích dẫn." }
        ]
      },
      {
        sanskrit: "ई",
        iast: "ī",
        english: "Long 'ee', like in 'feet'.",
        vietnamese: "Âm 'i' dài. Kéo dài hơi, như 'y' trong 'y tế'.",
        explanation: "Sự làm chủ, thống trị (Ishvara).",
        vocabulary: [
          { word: "ईश्वर", iast: "īśvara", meaning: "Chúa tể/Thượng đế", detail: "Đấng tối cao cai quản vũ trụ." }
        ]
      },
      {
        sanskrit: "उ",
        iast: "u",
        english: "Short 'u', like in 'put'.",
        vietnamese: "Âm 'u' ngắn. Tròn môi, ngắn gọn.",
        explanation: "Sự mở ra (Unmesha).",
        vocabulary: [
          { word: "उपनिषद्", iast: "upaniṣad", meaning: "Upanishad", detail: "Kinh điển triết học Ấn Độ cổ đại." }
        ]
      },
      {
        sanskrit: "ऊ",
        iast: "ū",
        english: "Long 'oo', like in 'pool'.",
        vietnamese: "Âm 'u' dài. Kéo dài hơi, tròn môi.",
        explanation: "Sự thiếu hụt hoặc giảm bớt (Ūna).",
        vocabulary: [
          { word: "ऊर्ध्व", iast: "ūrdhva", meaning: "Hướng lên", detail: "Chuyển động thăng thiên." }
        ]
      },
      {
        sanskrit: "ऋ",
        iast: "ṛ",
        english: "Vocalic 'ri', like in 'rim' but rolled.",
        vietnamese: "Âm 'ri' ngắn. Lưỡi cong lên chạm vòm họng. Như 'r' trong tiếng Bắc nhưng là nguyên âm.",
        explanation: "Sự thật vũ trụ (Ṛta).",
        vocabulary: [
          { word: "ऋषि", iast: "ṛṣi", meaning: "Hiền triết", detail: "Nhà tiên tri, người thấy chân lý." }
        ]
      },
      {
        sanskrit: "ए",
        iast: "e",
        english: "Long 'a', like in 'gate'.",
        vietnamese: "Âm 'ê' dài. Luôn là âm dài trong Sanskrit.",
        explanation: "Sự hợp nhất (Eka).",
        vocabulary: [
          { word: "एक", iast: "eka", meaning: "Một", detail: "Số một, sự đơn nhất." }
        ]
      },
      {
        sanskrit: "ऐ",
        iast: "ai",
        english: "Diphthong 'ai', like in 'aisle'.",
        vietnamese: "Nhị trùng âm 'ai'.",
        explanation: "Sự hợp nhất của Shiva và Shakti.",
        vocabulary: [
          { word: "ऐश्वर्य", iast: "aiśvarya", meaning: "Uy quyền", detail: "Sự giàu có, quyền lực thiêng liêng." }
        ]
      },
      {
        sanskrit: "ओ",
        iast: "o",
        english: "Long 'o', like in 'go'.",
        vietnamese: "Âm 'ô' dài. Luôn là âm dài.",
        explanation: "Sức sống (Ojas).",
        vocabulary: [
          { word: "ओजस्", iast: "ojas", meaning: "Sinh lực", detail: "Năng lượng tinh tế trong cơ thể." }
        ]
      },
      {
        sanskrit: "औ",
        iast: "au",
        english: "Diphthong 'ou', like in 'house'.",
        vietnamese: "Nhị trùng âm 'au'.",
        explanation: "Âm chữa lành (Auṣadha).",
        vocabulary: [
          { word: "औषध", iast: "auṣadha", meaning: "Thuốc", detail: "Dược thảo chữa bệnh." }
        ]
      }
    ]
  },
  {
    id: 1,
    title: "Gayatri Mantra",
    category: "Mantra",
    description: "Câu thần chú mẹ của mọi thần chú, cầu nguyện sự khai sáng trí tuệ từ ánh sáng mặt trời thiêng liêng.",
    content: [
      {
        sanskrit: "ॐ भूर्भुवः स्वः",
        iast: "Oṃ bhūr bhuvaḥ svaḥ",
        english: "Om, the earth, the air, the heavens.",
        vietnamese: "Om, quả đất (thân xác), bầu không khí (hơi thở) và bầu trời (tâm trí).",
        explanation: "Vyāhṛti - Lời xưng tụng mở đầu, kết nối tiểu vũ trụ và đại vũ trụ.",
        vocabulary: [
          { word: "ॐ", iast: "Oṃ", meaning: "Pranava", detail: "Âm thanh khởi nguyên của vũ trụ." },
          { word: "भूर", iast: "bhūr", meaning: "Cõi trần", detail: "Thế giới vật chất (Bhu Loka)." },
          { word: "भुवः", iast: "bhuvaḥ", meaning: "Cõi trung giới", detail: "Thế giới khí/năng lượng (Bhuvar Loka)." },
          { word: "स्वः", iast: "svaḥ", meaning: "Cõi trời", detail: "Thế giới tinh thần (Svar Loka)." }
        ]
      },
      {
        sanskrit: "तत्सवितुर्वरेण्यं",
        iast: "tat savitur vareṇyaṃ",
        english: "That excellent glory of Savitr.",
        vietnamese: "Chúng con thiền định về vinh quang tuyệt diệu của Đấng Thái Dương (Savitr).",
        explanation: "Phần đầu ca ngợi nguồn sáng thiêng liêng.",
        vocabulary: [
          { word: "तत्", iast: "tat", meaning: "Đó/Ngài", detail: "Đại từ chỉ định, ám chỉ Thượng đế (Brahman)." },
          { word: "सवितुर", iast: "savitur", meaning: "Đấng Sáng Tạo", detail: "Mặt trời, nguồn gốc sự sống." },
          { word: "वरेण्यं", iast: "vareṇyaṃ", meaning: "Đáng tôn thờ", detail: "Tuyệt hảo, ưu việt nhất." }
        ]
      },
      {
        sanskrit: "भर्गो देवस्य धीमहि",
        iast: "bhargo devasya dhīmahi",
        english: "The effulgence of the Divine, we meditate upon.",
        vietnamese: "Ánh sáng rực rỡ của Đấng Thiêng Liêng mà chúng con hằng chiêm nghiệm.",
        explanation: "Hành động thiền định tập trung vào ánh sáng.",
        vocabulary: [
          { word: "भर्गो", iast: "bhargo", meaning: "Hào quang", detail: "Ánh sáng loại bỏ bóng tối vô minh." },
          { word: "देवस्य", iast: "devasya", meaning: "Của chư thiên", detail: "Thuộc về đấng thiêng liêng." },
          { word: "धीमहि", iast: "dhīmahi", meaning: "Chúng con thiền định", detail: "Sự tập trung tâm trí sâu sắc." }
        ]
      },
      {
        sanskrit: "धियो यो नः प्रचोदयात्",
        iast: "dhiyo yo naḥ pracodayāt",
        english: "May He inspire our intellect.",
        vietnamese: "Cầu mong Ngài khai sáng trí tuệ của chúng con.",
        explanation: "Lời cầu nguyện cuối cùng xin sự dẫn dắt.",
        vocabulary: [
          { word: "धियो", iast: "dhiyo", meaning: "Trí tuệ", detail: "Buddhi - Khả năng nhận thức chân lý." },
          { word: "यो", iast: "yo", meaning: "Người mà", detail: "Đại từ quan hệ, ám chỉ Savitr." },
          { word: "नः", iast: "naḥ", meaning: "Của chúng con", detail: "Không phải chỉ cho riêng tôi, mà cho tất cả." },
          { word: "प्रचोदयात्", iast: "pracodayāt", meaning: "Khai sáng/Thúc đẩy", detail: "Dẫn dắt đi đúng hướng." }
        ]
      }
    ]
  }
];