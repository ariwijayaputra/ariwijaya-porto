import { type SchemaTypeDefinition } from 'sanity'
import { cv } from './cv'
import { localeBullets, localeString, localeText } from './locale'
import { project } from './project'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, cv, localeString, localeText, localeBullets],
}
