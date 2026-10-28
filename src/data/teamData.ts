export interface TeamMember {
  name: string;
  image: string;
  quote: string;
  link?: string;
}

export const TEAM_DATA: TeamMember[] = [
  {
    name: "KAREEM OMAR",
    image: "/KAREEM_OMAR.png",
    quote: "نسعى دائماً لترك أثر رقمي يُفيد الأمة ويواكب تطلعات المستقبل.",
    link: "https://kemo-omar.github.io/Kareem/"
  },
  {
    name: "MOSTAFA MOHAMED",
    image: "/MOSTAFA_MOHAMED.png",
    quote: "الإبداع لا حدود له عندما تجتمع العقول على هدف واحد سامٍ."
  },
  {
    name: "YOUSSEF MOSTAFA",
    image: "/YOUSSEF_MOSTAFA.png",
    quote: "الجمال يكمن في بساطة التفاصيل ودقة التنفيذ."
  },
  {
    name: "YOUSSIF AWES",
    image: "/YOUSSIF_AWES.png",
    quote: "خلف كل واجهة ناجحة، نظام متين مبني بشغف وإتقان."
  },
  {
    name: "MOHAMED BARAKAT",
    image: "/MOHAMED_BARAKAT.png",
    quote: "رمضان يجمعنا دائماً على دروب الخير والإبداع التقني."
  }
];
