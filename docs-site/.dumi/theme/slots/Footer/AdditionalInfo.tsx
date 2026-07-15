import * as React from 'react';
import { removeCSS, updateCSS } from '@rc-component/util';
import { createStaticStyles } from 'antd-style';
import { useAppData } from 'dumi';

const whereCls = 'phoenix-where-checker';

const styles = createStaticStyles(({ css, cssVar }) => ({
  container: css`
    position: fixed;
    inset-inline-start: 0;
    inset-inline-end: 0;
    top: 0;
    bottom: 0;
    z-index: 99999999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${cssVar.colorTextSecondary};
  `,
  alertBox: css`
    width: 520px;
    padding: ${cssVar.paddingXS} ${cssVar.paddingSM};
    color: ${cssVar.colorTextHeading};
    line-height: 22px;
    background-color: ${cssVar.colorWarningBg};
    border: 1px solid ${cssVar.colorWarningBorder};
    border-radius: ${cssVar.borderRadiusLG};
    z-index: 9999999999;

    a {
      color: ${cssVar.colorPrimary};
      text-decoration-line: none;
    }
  `,
}));

const AdditionalInfo: React.FC = () => {
  const { base = '/' } = useAppData();
  const [supportWhere, setSupportWhere] = React.useState(true);

  React.useEffect(() => {
    const paragraph = document.createElement('p');
    paragraph.className = whereCls;
    paragraph.style.position = 'fixed';
    paragraph.style.pointerEvents = 'none';
    paragraph.style.visibility = 'hidden';
    paragraph.style.width = '0';
    document.body.appendChild(paragraph);

    updateCSS(
      `
:where(.${whereCls}) {
  content: "__CHECK__";
}
      `,
      whereCls,
    );

    const { content } = getComputedStyle(paragraph);
    setSupportWhere(String(content).includes('CHECK'));

    document.body.removeChild(paragraph);
    removeCSS(whereCls);
  }, []);

  if (supportWhere) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.alertBox}>
        你的浏览器不支持现代 CSS Selector，请使用 Chrome、Firefox 或 Safari 等现代浏览器访问。
        如果你需要排查样式兼容问题，请查阅
        <a href={`${base}pitfalls/06-overriding-dumi-default-layout`}>布局覆写踩坑记录</a>。
      </div>
    </div>
  );
};

export default AdditionalInfo;
