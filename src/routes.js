import React, { Component } from "react"
import { Route } from "react-router"
import { PageContainer as PhenomicPageContainer } from "phenomic"

import AppContainer from "./AppContainer.js"

import Page from "./layouts/Page"
import PageError from "./layouts/PageError"
import PageLoading from "./layouts/PageLoading"
import Homepage from "./layouts/Homepage"
import Post from "./layouts/Post"
import Posts from "./layouts/Posts"
import AdventCalendar from "./layouts/AdventCalendar"

import PostsByTag from "./components/PostsByTag"
import PostsByAuthor from "./components/PostsByAuthor"

class PageContainer extends Component {
  render() {
    const { props } = this
    return (
      <PhenomicPageContainer
        { ...props }
        layouts={ {
          Page,
          PageError,
          PageLoading,
          Homepage,
          Post,
          Posts,
          AdventCalendar,
        } }
      />
    )
  }
}

// routes
export default (
  <Route component={ AppContainer }>
    <Route path="fr/tag/:tag" component={ PostsByTag } />
    <Route path="en/tag/:tag" component={ PostsByTag } />
    <Route path="fr/author/:author" component={ PostsByAuthor } />
    <Route path="en/author/:author" component={ PostsByAuthor } />
    <Route path="*" component={ PageContainer } />
  </Route>
)
