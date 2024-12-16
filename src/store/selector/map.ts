/* eslint-disable no-underscore-dangle */
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const layerCategorySelector = (state: RootState) =>
  state.mapSlice.layerCategoryList;
export const layerSubCategorySelector = (state: RootState) =>
  state.mapSlice.layerSubCategoryList;
export const layerList = (state: RootState) => state.mapSlice.layerList;
export const subLayerList = (state: RootState) => state.mapSlice.subLayerList;

export const categorySelector = createSelector(
  layerCategorySelector,
  layerSubCategorySelector,
  layerList,
  subLayerList,
  (categoryList, subcategoryList, layers, subLayers) => {
    const categorizedLayers = categoryList?.map(
      (category: Record<string, any>) => ({
        id: category.id,
        name_en: category.name_en,
        subcategory: subcategoryList
          ?.filter(
            (subcategory: Record<string, any>) =>
              subcategory.category === category.id,
          )
          .map((filteredSubCategory: Record<string, any>) => ({
            id: filteredSubCategory.id,
            name_en: filteredSubCategory.name_en,
            details: filteredSubCategory.details,
            layers: layers
              .filter(
                (layer: Record<string, any>) =>
                  layer.subcategory === filteredSubCategory.name_en &&
                  layer.category === category.name_en,
              )
              .map(layer => {
                const filteredSubLayers = subLayers.filter(itm => {
                  return itm._layer_id === layer.feature_id;
                });

                return {
                  ...layer,
                  hasSubLayerList: filteredSubLayers.length > 0,
                  subLayerList: filteredSubLayers,
                  subLayerListName: layer.name_en,
                };
              }),
          })),
      }),
    );
    return [...categorizedLayers];
  },
);
