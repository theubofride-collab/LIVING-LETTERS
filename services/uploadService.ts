import apiClient from '@/lib/apiClient'

export const uploadService = {
  async uploadImage(file: File): Promise<{ url: string; publicId: string; width: number; height: number }> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.post('/v1/upload', formData, {
      transformRequest: [(data, headers) => {
        delete (headers as any)['Content-Type']
        return data
      }],
    })
    return res.data
  },

  async deleteImage(publicId: string): Promise<void> {
    await apiClient.delete(`/v1/upload/${encodeURIComponent(publicId)}`)
  },
}
