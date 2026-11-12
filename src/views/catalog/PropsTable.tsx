import type { PropDoc } from './types';
import s from './Catalog.module.css';

/** props 설명 표 — 이름 / 타입 / 기본값 / 설명 */
export function PropsTable({ props, caption }: { props: PropDoc[]; caption: string }) {
  return (
    <div className={s.propsWrap}>
      <table className={s.props}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">prop</th>
            <th scope="col">타입</th>
            <th scope="col">기본값</th>
            <th scope="col">설명</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td>
                <code>{p.name}</code>
                {p.required && <span className={s.reqMark}> 필수</span>}
              </td>
              <td>
                <code className={s.type}>{p.type}</code>
              </td>
              <td>{p.default ? <code>{p.default}</code> : <span className={s.none}>—</span>}</td>
              <td>{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
