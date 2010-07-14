// ==========================================================================
// Project:   TestApp - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals TestApp */

// This page describes the main user interface for your application.  
TestApp.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'testView'.w(),
    
    testView: TestApp.TestView.design({
      layerId: 'test-view',
      layout: { centerX: 0, centerY: 0, width: 300, height: 300 },
      backgroundColor: 'green'
    })
  })

});