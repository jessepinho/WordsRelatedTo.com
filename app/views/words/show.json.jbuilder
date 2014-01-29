json.extract! @word, :id, :word
json.url word_url(@word, format: :json)

json.related_words @word.related_words do |related|
  json.extract! related, :id, :word
  json.url word_url(related, format: :json)
end

json.relating_words @word.relating_words do |relating|
  json.extract! relating, :id, :word
  json.url word_url(relating, format: :json)
end
