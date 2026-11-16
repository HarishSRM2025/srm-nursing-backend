// Stored numbers determine read order; submitted array order determines edit order.
function normalizeSection(section, sortStored = false) {
  const numbered = (rows, key = 'num') => {
    const ordered = [...(rows || [])];
    if (sortStored) ordered.sort((a, b) => Number(a[key]) - Number(b[key]));
    return ordered.map((row, index) => ({ ...row, [key]: key === 'sno' ? String(index + 1) : index + 1 }));
  };
  return {
    ...section,
    table: numbered(section.table, 'sno'),
    boys: numbered(section.boys),
    girls: numbered(section.girls),
    rules: numbered(section.rules).map(rule => ({
      ...rule,
      ...(rule.punishments ? { punishments: numbered(rule.punishments) } : {}),
    })),
  };
}
module.exports = normalizeSection;
