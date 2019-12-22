export interface subLinkNode {
  url: string
  note: string
}

export interface subLinkNoteItem extends subLinkNode {
  id: string
  update: number,
  list: any[]
}