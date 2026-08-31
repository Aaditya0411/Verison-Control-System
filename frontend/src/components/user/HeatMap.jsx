/* eslint-disable react/prop-types */
import { useMemo } from "react";
import React from "react";

export default function HeatMapProfile({ count = 0 }) {
  const cells = useMemo(() => Array.from({ length: 182 }, (_, index) => {
    const activity = (index * 7 + count * 3) % 11;
    return activity > 8 ? 4 : activity > 5 ? 3 : activity > 2 ? 2 : activity ? 1 : 0;
  }), [count]);
  return <><div className="heatmap" aria-label="Contribution activity">{cells.map((level, index) => <span key={index} className={`heatmap-cell level-${level}`} />)}</div><div className="heatmap-footer"><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`heatmap-cell level-${level}`} />)}<span>More</span></div></>;
}
