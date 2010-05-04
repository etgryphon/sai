# ==========================================================================
# Sai JavaScript Framework - Buildfile
# copyright (c) 2010 - Evin Grano, and contributors
# ==========================================================================

# This buildfile defines the configurations needed to link together the 
# various frameworks that make up CoreOrion.  If you want to override some
# of these settings, you should make changes to your project Buildfile 
# instead.
config :all, 
  :required => ['sproutcore/runtime'],
  :layout         => 'sai:lib/index.rhtml',
  :test_layout    => 'sai:lib/test.rhtml',
  :test_required  => ['sproutcore'],
  :debug_required => ['sproutcore']

# in debug mode, combine the JS for SC by default.  This will improve perf
# while working with apps.  If you are hacking SC itself, you can turn this
# off in your project buildfile by referencing sproutcore specifically
mode :debug do
  config :all, 
    :combine_javascript => true,
    :combine_stylesheet => true
end
