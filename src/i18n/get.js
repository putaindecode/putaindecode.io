import getLang from "./getLang";

export default function getI18n(context) {
  return context.metadata.i18n[getLang(context)];
}
