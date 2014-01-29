class Word < ActiveRecord::Base
  has_and_belongs_to_many :related_words, class_name: 'Word', foreign_key: 'related_id', association_foreign_key: 'relating_id', join_table: :relations
  has_and_belongs_to_many :relating_words, class_name: 'Word', foreign_key: 'relating_id', association_foreign_key: 'related_id', join_table: :relations
end
