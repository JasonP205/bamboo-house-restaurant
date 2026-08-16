const LOCALES = ["en", "vi"];

/**
 * Project metadata of this repository, exposed for the portfolio website.
 * Localized text fields follow the shape Record<Locale, string>.
 */
const project = {
  id: "bamboo-house-restaurant",
  title: {
    en: "Bamboo House Restaurant",
    vi: "Nhà Hàng Bamboo House",
  },
  description: {
    en: "A bilingual, multi-branch restaurant management platform with QR table ordering and realtime order tracking.",
    vi: "Nền tảng quản lý nhà hàng đa chi nhánh song ngữ với đặt món qua mã QR tại bàn và theo dõi đơn hàng thời gian thực.",
  },
  fullDescription: {
    en: "The Bamboo House Restaurant Management System is a full-stack platform that digitizes daily operations of a multi-branch restaurant. Managers administer branches, tables, menus and staff from one workspace, staff monitor incoming orders on a realtime dashboard, and customers order straight from their table by scanning a table-specific QR link. The frontend is built with React 19, TypeScript and Vite, styled with HeroUI v3 and Tailwind CSS v4, with Zustand for state slices, react-hook-form and Zod for validation, and i18next for full English/Vietnamese localization. The backend runs on Express 5 with MongoDB and Mongoose, JWT authentication backed by refresh sessions, Google OAuth 2.0 via Passport, Cloudinary for image storage, DeepL for bilingual menu content, and Socket.IO to keep customer carts, staff monitors and order statuses in sync.",
    vi: "Hệ thống quản lý nhà hàng Bamboo House là một nền tảng full-stack số hóa các hoạt động hằng ngày của một chuỗi nhà hàng nhiều chi nhánh. Quản lý điều hành chi nhánh, bàn, thực đơn và nhân viên trong cùng một không gian làm việc; nhân viên theo dõi đơn hàng đến trên bảng điều khiển thời gian thực; khách hàng đặt món ngay tại bàn bằng cách quét mã QR riêng của bàn. Giao diện được xây dựng bằng React 19, TypeScript và Vite, thiết kế với HeroUI v3 và Tailwind CSS v4, dùng Zustand cho quản lý trạng thái, react-hook-form và Zod để kiểm tra dữ liệu, cùng i18next cho song ngữ Anh/Việt. Phía máy chủ dùng Express 5 với MongoDB và Mongoose, xác thực JWT kèm phiên làm mới, đăng nhập Google OAuth 2.0 qua Passport, Cloudinary để lưu trữ hình ảnh, DeepL cho nội dung thực đơn song ngữ và Socket.IO để đồng bộ giỏ hàng của khách, màn hình theo dõi của nhân viên và trạng thái đơn hàng.",
  },
  image: [
    {
      src: "/img/hero-section.png",
      alt: "Bamboo House landing page hero section",
    },
    {
      src: "/img/flycam-bamboo-house.png",
      alt: "Aerial view of the Bamboo House restaurant",
    },
    {
      src: "/img/signature-dishes.png",
      alt: "Signature dishes showcased on the menu",
    },
    {
      src: "/img/indoor-space.png",
      alt: "Indoor dining space of the restaurant",
    },
  ],
  tags: [
    "React",
    "TypeScript",
    "Vite",
    "HeroUI",
    "Tailwind CSS",
    "Zustand",
    "i18next",
    "Node.js",
    "Express",
    "MongoDB",
    "Socket.IO",
    "Cloudinary",
    "JWT",
  ],
  isDone: true,
};

/** Resolve a project's localized text fields for the given locale. */
const localizeProject = (project, locale) => ({
  id: project.id,
  title: project.title[locale],
  description: project.description[locale],
  fullDescription: project.fullDescription[locale],
  image: project.image,
  tags: project.tags,
  liveUrl: project.liveUrl,
  isDone: project.isDone,
});

export const fetchCopyrights = (req, res) => {
  try {
    const { locale } = req.query;

    if (!locale) {
      return res.status(200).json(project);
    }

    if (!LOCALES.includes(locale)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported locale "${locale}". Supported locales: ${LOCALES.join(", ")}`,
      });
    }

    return res.status(200).json(localizeProject(project, locale));
  } catch (error) {
    console.error("Error fetching copyrights:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
