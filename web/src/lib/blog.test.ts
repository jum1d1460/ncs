import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@sanity/client', () => {
  const fetch = vi.fn()
  return {
    createClient: () => ({ fetch }),
    __mock__: { fetch }
  }
})

import { fetchBlogPostsForBlock, type BlockBlogPosts } from './blog'

let fetchMock: ReturnType<typeof vi.fn>

describe('fetchBlogPostsForBlock', () => {
  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('@sanity/client')
    // @ts-expect-error helper exposed by mock
    fetchMock = mod.__mock__.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('antepone destacados y completa hasta n sin duplicar', async () => {
    const block: BlockBlogPosts = {
      _type: 'blockBlogPosts',
      limit: 3,
      featuredPosts: [{ _ref: 'a' }, { _ref: 'b' }]
    }

    fetchMock.mockResolvedValueOnce({
      featuredMatched: [
        { _id: 'b', title: 'B', slug: { current: 'b' }, publishedAt: '2024-04-02' },
        { _id: 'a', title: 'A', slug: { current: 'a' }, publishedAt: '2024-04-01' }
      ],
      filler: [
        { _id: 'a', title: 'A', slug: { current: 'a' }, publishedAt: '2024-04-01' },
        { _id: 'c', title: 'C', slug: { current: 'c' }, publishedAt: '2024-03-01' },
        { _id: 'd', title: 'D', slug: { current: 'd' }, publishedAt: '2024-02-01' }
      ]
    })

    const res = await fetchBlogPostsForBlock(block)
    expect(res.map(p => p._id)).toEqual(['b', 'a', 'c'])
  })

  it('trunca cuando destacados > n', async () => {
    const block: BlockBlogPosts = {
      _type: 'blockBlogPosts',
      limit: 1,
      featuredPosts: [{ _ref: 'x' }, { _ref: 'y' }]
    }

    fetchMock.mockResolvedValueOnce({
      featuredMatched: [
        { _id: 'y', title: 'Y', slug: { current: 'y' }, publishedAt: '2024-04-02' },
        { _id: 'x', title: 'X', slug: { current: 'x' }, publishedAt: '2024-04-01' }
      ],
      filler: []
    })

    const res = await fetchBlogPostsForBlock(block)
    expect(res.map(p => p._id)).toEqual(['y'])
  })

  it('filtra por categoría cuando cat está definida', async () => {
    const block: BlockBlogPosts = {
      _type: 'blockBlogPosts',
      limit: 2,
      category: { _ref: 'cat1' },
      featuredPosts: []
    }

    fetchMock.mockResolvedValueOnce({
      featuredMatched: [],
      filler: [
        { _id: 'p1', title: 'P1', slug: { current: 'p1' }, publishedAt: '2024-04-02' },
        { _id: 'p2', title: 'P2', slug: { current: 'p2' }, publishedAt: '2024-04-01' }
      ]
    })

    const res = await fetchBlogPostsForBlock(block)
    expect(res).toHaveLength(2)
  })
})
