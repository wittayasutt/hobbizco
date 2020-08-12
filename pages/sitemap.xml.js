/* eslint-disable camelcase */
/* eslint-disable indent */
import React from 'react'
import { getPlayList } from '../services/playlist'
import { getList as getVideo } from '../services/video'

const SitemapPage = () => {
  return <></>
}

export default SitemapPage

const helper = {
  domain: 'https://www.proteachervideo.com',
  currentDate: new Date().toISOString(),
  renderStatic: () => {
    const pages = [
      // category
      {
        loc: `${helper.domain}/home`,
        lastmod: helper.currentDate,
        priority: '1.00',
      },
      {
        loc: `${helper.domain}/role-list`,
        lastmod: helper.currentDate,
        priority: '0.8',
      },
      {
        loc: `${helper.domain}/search-results`,
        lastmod: helper.currentDate,
        priority: '0.8',
      },
      {
        loc: `${helper.domain}/subject-list`,
        lastmod: helper.currentDate,
        priority: '0.8',
      },
      {
        loc: `${helper.domain}/top-series-list`,
        lastmod: helper.currentDate,
        priority: '0.8',
      },
      {
        loc: `${helper.domain}/whole-school-issue-list`,
        lastmod: helper.currentDate,
        priority: '0.8',
      },

      // other
      {
        loc: `${helper.domain}/about-us`,
        lastmod: helper.currentDate,
        priority: '0.8',
      },
      {
        loc: `${helper.domain}/contact-us`,
        lastmod: helper.currentDate,
        priority: '0.8',
      },
      {
        loc: `${helper.domain}/terms-of-use`,
        lastmod: helper.currentDate,
        priority: '0.8',
      },
    ]

    const urls = pages.map((page) => {
      return `<url>
        <loc>${page.loc}</loc>
        <lastmod>${page.lastmod}</lastmod>
        <priority>${page.priority}</priority>
      </url>`
    })
    return urls.join('')
  },
  renderVideo: async () => {
    const pathName = 'programme'
    const {
      data: { rows },
    } = await getVideo()

    const urls = rows.map((video) => {
      return `<url>
        <loc>${helper.domain}/${pathName}/${video.id}/${video.slug}</loc>
        <lastmod>${helper.currentDate}</lastmod>
        <priority>${0.5}</priority>
      </url>`
    })

    return urls.join('')
  },
  renderTopseries: async () => {
    const pathName = 'programme-list-by-series'
    const [cpd, inClass] = await Promise.all([
      getPlayList({ sub_category_id: 1 }),
      getPlayList({ sub_category_id: 2 }),
    ])

    const urls = [...cpd.data.playlists, ...inClass.data.playlists].map((page) => {
      return `<url>
        <loc>${helper.domain}/${pathName}/${page.id}/${page.slug}</loc>
        <lastmod>${helper.currentDate}</lastmod>
        <priority>${0.5}</priority>
      </url>`
    })

    return urls.join('')
  },

  renderRoles: async () => {
    const pathName = 'programme-list-by-vocabulary-and-term-data'
    const [primary, secondary] = await Promise.all([
      getPlayList({ sub_category_id: 5 }),
      getPlayList({ sub_category_id: 6 }),
    ])

    const urls = [...primary.data.playlists, secondary.data.playlists].map((page) => {
      return `<url>
        <loc>${helper.domain}/${pathName}/${page.id}/${page.slug}</loc>
        <lastmod>${helper.currentDate}</lastmod>
        <priority>${0.5}</priority>
      </url>`
    })

    return urls.join('')
  },
  renderSubjectsAndWholeSchool: async () => {
    const [
      primarySubjects,
      secondarySubjects,
      primaryWholeSchool,
      secondaryWholeSchool,
    ] = await Promise.all([
      getPlayList({ sub_category_id: 3 }), // subjects
      getPlayList({ sub_category_id: 4 }), // subjects
      getPlayList({ sub_category_id: 7 }), // whole school
      getPlayList({ sub_category_id: 8 }), // whole school
    ])

    const urls = [
      ...primarySubjects.data.playlists,
      ...secondarySubjects.data.playlists,
      ...primaryWholeSchool.data.playlists,
      ...secondaryWholeSchool.data.playlists,
    ].map((playlist) => {
      // has subplaylist
      if (playlist?.sub_playlists?.length > 0) {
        const playlistPathName = 'next-level-list'
        const subPlaylistPathName = 'programme-list-by-vocabulary-and-term-data/sub'

        const playlistUrl = `<url>
            <loc>${helper.domain}/${playlistPathName}/${playlist.id}/${
          playlist.slug
        }</loc>
            <lastmod>${helper.currentDate}</lastmod>
            <priority>${0.5}</priority>
          </url>`
        const subPlaylistUrls = playlist?.sub_playlists?.map((subPlaylist) => {
          return `<url>
              <loc>${helper.domain}/${subPlaylistPathName}/${subPlaylist.id}/${
            subPlaylist.slug
          }</loc>
              <lastmod>${helper.currentDate}</lastmod>
              <priority>${0.5}</priority>
            </url>`
        })

        return `${playlistUrl}${subPlaylistUrls.join('')}`
      }

      const playlistPathName = 'programme-list-by-vocabulary-and-term-data'

      return `<url>
          <loc>${helper.domain}/${playlistPathName}/${playlist.id}/${playlist.slug}</loc>
          <lastmod>${helper.currentDate}</lastmod>
          <priority>${0.5}</priority>
        </url>`
    })

    return urls.join('')
  },
}

export async function getServerSideProps({ res }) {
  const [
    videoSitemap,
    topSeriesSitemap,
    rolesSitemap,
    subjectsAndWholeSchoolSitemap,
  ] = await Promise.all([
    helper.renderVideo(),
    helper.renderTopseries(),
    helper.renderRoles(),
    helper.renderSubjectsAndWholeSchool(),
  ])

  res.setHeader('Content-Type', 'text/xml')
  res.write(
    `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${helper.renderStatic()}
        ${videoSitemap}
        ${topSeriesSitemap}
        ${rolesSitemap}
        ${subjectsAndWholeSchoolSitemap}
      </urlset>
    `,
  )
  res.end()

  return {
    props: {},
  }
}
