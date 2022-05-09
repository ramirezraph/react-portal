const getLessonNumber = (unitTitle: string) => {
  return unitTitle.substring(7);
};

export { getLessonNumber };
