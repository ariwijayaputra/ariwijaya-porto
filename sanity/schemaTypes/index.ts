import { type SchemaTypeDefinition } from 'sanity'
import { cv } from './cv'
import { project } from './project'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, cv],
}
