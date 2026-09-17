import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // singleton: always the same document id, so there's only ever one CV
      S.listItem()
        .title('CV')
        .id('cv')
        .child(S.document().schemaType('cv').documentId('cv')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'cv'),
    ])
