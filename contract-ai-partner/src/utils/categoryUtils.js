const mapCategoriesForGrid = (data) =>
    data &&
    data.map((category) => ({
        id: category.id,
        name: category.name,
        countOfStandards: category.countOfStandards,
        countOfAgreements: category.countOfAgreements,
        createdAt: category.createdAt
    }));

export default mapCategoriesForGrid;
