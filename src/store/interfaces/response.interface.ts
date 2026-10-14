export interface IDataResponse<T = unknown> {
  success: boolean
  data: T
  error?: string | null
}
